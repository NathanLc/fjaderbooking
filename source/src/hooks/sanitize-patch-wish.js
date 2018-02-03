'use strict';

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return hook => {

    return Promise.resolve(hook);
  };
};
