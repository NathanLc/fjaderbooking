'use strict';

const moment = require('moment');

module.exports = (options = {}) => { // eslint-disable-line no-unused-vars
  return hook => {
    const errorGeneric = 'hooks:sanitize-create-wish, ';
    const data = hook.data;

    if (!data.day) {
      throw new Error(errorGeneric + 'missing parameter: day.');
    } else if (!moment(data.day, 'YYYY-MM-DD').isValid()) {
      throw new Error(errorGeneric + 'data.day, invalid format, expected YYYY-MM-DD, got: ' + data.day);
    }
    if (!data.after) {
      throw new Error(errorGeneric + 'missing parameter: after.');
    }
    if (!data.before) {
      throw new Error(errorGeneric + 'missing parameter: before.');
    }
    if (!data.floor) {
      throw new Error(errorGeneric + 'missing parameter: floor.');
    } else if (['upstairs', 'anywhere'].indexOf(data.floor) === -1) {
      throw new Error(errorGeneric + 'invalid value for floor: ' + data.floor);
    }

    const fieldsRange = data.floor === 'upstairs' ? 10 : 15;
    const fields = [];
    for (let i = 1; i <= fieldsRange; i++) {
      fields.push(i);
    }

    hook.data = {
      day: moment(data.day, 'YYYY-MM-DD').valueOf(),
      after: data.after,
      before: data.before,
      timespan: data.after + '-' + data.before,
      floor: data.floor,
      fields: fields
    };

    return Promise.resolve(hook);
  };
};
