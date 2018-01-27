'use strict';

const { authenticate } = require('feathers-authentication').hooks;
const { associateCurrentUser, restrictToOwner } = require('feathers-authentication-hooks');
const { disallow, serialize } = require('feathers-hooks-common');
const moment = require('moment');
const sanitizeCreateWish = require('../../hooks/sanitize-create-wish');
const sanitizePatchWish = require('../../hooks/sanitize-patch-wish');

const serializeSchema = {
  computed: {
    day: (wish, hook) => moment(wish.day).format('YYYY-MM-DD')
  }
};

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [restrictToOwner()],
    get: [restrictToOwner()],
    create: [sanitizeCreateWish(), associateCurrentUser()],
    update: [disallow('external')],
    patch: [restrictToOwner(), sanitizePatchWish()],
    remove: [restrictToOwner()]
  },

  after: {
    all: [serialize(serializeSchema)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
