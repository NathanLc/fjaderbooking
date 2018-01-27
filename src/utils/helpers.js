'use strict';

const axios = require('axios');
const FjaderCrawler = require('./FjaderCrawler');

const fjaderborgen = () => {
  const fjaderborgen = FjaderCrawler();

  const getAvailableBookings = (date = '') => {
    return fjaderborgen.getAvailableBookings(date);
  };

  const book = (matches = [], credentials = {}) => {
    return fjaderborgen.book(matches, credentials);
  };

  return {
    getAvailableBookings: getAvailableBookings,
    book: book
  };
};

const slack = () => {
  const uri = 'https://hooks.slack.com/services/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';

  const sendMessage = message => {
    return axios.post(uri, {
      text: message
    })
    .then(response => {
      return response.data;
    })
    .catch(err => { console.warn('helpers.slack.sendMessage, error: ', err); });
  };

  return {
    sendMessage: sendMessage
  };
};

const helpers = {
  fjaderborgen: fjaderborgen(),
  slack: slack()
};

module.exports = helpers;
