const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const moment = require('moment');
const axios = require('axios');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const helpers = require('./utils/helpers');

const authentication = require('./authentication');

const app = feathers();

// Load app configuration
app.configure(configuration(path.join(__dirname, '..')));
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', feathers.static(app.get('public')));

// Set up Plugins and providers
app.configure(hooks());
app.configure(rest());
app.configure(socketio());

app.configure(authentication);

// Set up our services (see `services/index.js`)
app.configure(services);
// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);
app.hooks(appHooks);

const wishService = app.service('wishes');
const thisMorning = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
setInterval(() => {
  wishService.find({
    query: {
      day: { $gte: thisMorning.valueOf() },
      fulfilled: { $ne: true }
    }
  })
  .then(wishes => {
    return wishes.reduce((dailyWishes, wish) => {
      dailyWishes[wish.day] = Array.isArray(dailyWishes[wish.day]) ? [...dailyWishes[wish.day], wish] : [wish];
      return dailyWishes;
    }, {});
  })
  .then(dailyWishes => {
    return Object.keys(dailyWishes).map((day) => {
      const wishesList = dailyWishes[day];

      return helpers.fjaderborgen.getAvailableBookings(day)
        .then(availableBookings => {
          return wishesList.map(wish => {
            wish.matches = availableBookings
              .filter(booking => moment(booking.start, 'HH:mm').isSameOrAfter(moment(wish.after, 'HH:mm')))
              .filter(booking => moment(booking.end, 'HH:mm').isSameOrBefore(moment(wish.before, 'HH:mm')))
              .filter(booking => wish.fields.indexOf(booking.field) !== -1);
            return wish;
          });
        })
        .catch(err => { console.warn('App:helpers.fjaderborgen.getAvailableBookings, error: ', err); });
    });
  })
  .then(dailyPromises => {
    return axios.all(dailyPromises)
    .then(dailyWishes => {
      return dailyWishes.reduce((wishes, wishesList) => {
        return [...wishes, ...wishesList];
      }, []);
    })
    .then(wishes => {
      wishes.filter(wish => wish.matches.length > 0)
        .forEach(wish => {
          const chosenBooking = wish.matches[0];

          helpers.fjaderborgen.book([chosenBooking], app.get('fjaderCredentials'))
            .then(() => {
              wishService.patch(wish._id, { fulfilled: true, booking: chosenBooking }, {})
                .then(patchedWish => {
                  const message = 'Booking found for the ' + patchedWish.day + ' at ' + chosenBooking.timespan + ', field ' + chosenBooking.field + '.';

                  helpers.slack.sendMessage(message)
                    .catch(() => {
                      helpers.slack.sendMessage(message)
                        .catch(err => { console.warn('app, sendMessage, error: ', err); });
                    });
                })
                .catch(err => { console.warn('app,wishServie.patch, error: ', err); });
            })
            .catch(err => { console.warn('app, book, error: ', err); });
        });
    })
    .catch(err => { console.warn('App:dailyWishes, error: ', err); });
  })
  .catch(err => { console.warn('App:wish:find, error: ', err); });
}, 60000);

module.exports = app;
