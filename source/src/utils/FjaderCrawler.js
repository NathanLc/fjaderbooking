'use strict';

const request = require('request-promise-native');
const cheerio = require('cheerio');
const Booking = require('./Booking');

const FjaderCrawler = (credentials = { username: '', password: '' }) => {
  const baseUri = 'https://fjaderborgen.se';
  const fjaderCredentials = credentials;
  let parser = {};

  const getHtml = (uri) => {
    return request.get(uri)
      .then(data => {
        return data;
      })
      .catch(err => {
        console.warn('FjaderCrawler:getHtml, error: ', err);
      });
  };

  const getBookingsPage = (date = '') => {
    const bookingUri = baseUri + '/booking/booking.php' +
      (date === '' ? '' : '?showDate=' + date);

    return getHtml(bookingUri)
      .catch(err => { console.warn('FjaderCrawler:getBookinsPage, error: ', err); });
  };

  const getAvailableBookings = (date = '') => {
    const bookingTableSelector = '#booking table';

    return getBookingsPage(date)
      .then(html => {
        parser = cheerio.load(html);
        const table = parser(bookingTableSelector);
        return buildAvailableBookings(table);
      })
      .catch(err => {
        console.warn('FjaderCrawler:getAvailableBookings, error: ', err);
      });
  };

  const buildAvailableBookings = (table) => {
    const rowsNumber = table.find('tr').length;
    const columns = table.find('th').toArray();
    const cellsList = table.find('td').toArray();
    const cellsTable = [];
    const availableBookings = [];

    for (let i = 0; i < (rowsNumber - 2); i++) {
      let beginning = i * columns.length;
      let end = beginning + columns.length;
      cellsTable[i] = cellsList.slice(beginning, end);
    }

    for (let i = 0; i < cellsTable.length; i++) {
      let row = cellsTable[i];
      for (let j = 0; j < row.length; j++) {
        let timespan = parser(row[0]).text();
        let field = j;
        let cell = cellsTable[i][j];

        if (parser(cell).find('input[type="checkbox"]').length > 0) {
          let bookingValue = parser(cell).find('input[type="checkbox"]').val();
          availableBookings.push(Booking({ timespan: timespan, field: field, value: bookingValue }));
        }
      }
    }

    return availableBookings;
  };

  const book = (matches = [], credentials = fjaderCredentials) => {
    const errorGeneric = 'FjaderCrawler:book: ';
    if (!Array.isArray(matches) || matches.length === 0) {
      throw new Error(errorGeneric + 'incorrect parameter for matches, expected array, got: ' + typeof(matches) + '.');
    }
    if (!credentials.username) {
      throw new Error(errorGeneric + 'incorrect parameter for credentials, username is empty.');
    }
    if (!credentials.password) {
      throw new Error(errorGeneric + 'incorrect parameter for credentials, password is empty.');
    }

    const bookingUri = baseUri + '/booking/booking.php';
    const loginUri = baseUri + '/booking/booking_new.php';
    const confirmUri = baseUri + '/booking/booking_end.php';
    const fjaderCredentials = credentials;
    const cookieJar = request.jar();

    const isLoggedIn = () => {
      return request.get(bookingUri, {jar: cookieJar})
        .then(html => {
          const parser = cheerio.load(html);
          return parser('#login').length === 0;
        })
        .catch(err => { console.warn('FjaderCrawler:book:isLoggedIn, error: ', err); });
    };

    const logIn = () => {
      return request({
        uri: loginUri,
        method: 'POST',
        form: {
          'action': 'login',
          'forwardUrl': 'mypage/mypage_show.php',
          'uname': credentials.username,
          'pass': credentials.password
        },
        simple: false,
        resolveWithFullResponse: true,
        followAllRedirects: true,
        jar: cookieJar
      })
      .then(response => {
        const parser = cheerio.load(response.body);


        console.log(response.body);


        if (parser('#mypage').length === 1) {
          return response;
        } else {
          throw new Error('FjaderCrawler:book:logIn, authentication on fjaderborgen was not successful.');
        }
      })
      .catch(err => { console.warn('FjaderCrawler:book:logIn, error: ', err); });
    };

    const addBookingsToCart = matches => {
      const matchesValues = matches.map(match => match.value);

      return request({
        uri: loginUri,
        method: 'POST',
        form: {
          bookData: matchesValues
        },
        simple: false,
        resolveWithFullResponse: true,
        followAllRedirects: true,
        jar: cookieJar
      })
      .then(response => {
        const parser = cheerio.load(response.body);

        if (response.request.uri.href.includes('booking_confirm')
          && parser('#booking table tbody tr').length === (matches.length - 2)) {
          return response;
        } else {
          throw new Error('FjaderCrawler:book:addBookingsToCart, unable to add bookings to the cart.');
        }
      })
      .catch(err => { console.warn('FjaderCrawler:book:addBookingsToCart, error: ', err); });
    };

    const confirmBookings = () => {
      return request.get(confirmUri, {
        simple: false,
        jar: cookieJar
      })
      .then(response => {
        const parser = cheerio.load(response.body);
        if (response.request.uri.href.includes('booking_end')
          && parser('#booking table tbody tr').length === matches.length) {
          return response;
        } else {
          throw new Error('FjaderCrawler:book:confirmBookings, unable to confirm selected bookings.');
        }
      })
      .catch(err => { console.warn('FjaderCrawler:book:confirmBookings, error: ', err); });
    };

    return isLoggedIn()
    .then(loggedIn => {
      if (loggedIn) {
        return addBookingsToCart(matches);
      } else {
        return logIn()
          .then(addBookingsToCart(matches));
      }
    })
    .then(() => {
      return confirmBookings();
    })
    .catch(err => { console.warn('FjaderCrawler:book, error: ', err); });
  };

  return {
    getAvailableBookings: getAvailableBookings,
    book: book
  };
};

module.exports = FjaderCrawler;
