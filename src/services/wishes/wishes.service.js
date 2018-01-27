// Initializes the `wishes` service on path `/wishes`
const createService = require('feathers-nedb');
const createModel = require('../../models/wishes.model');
const hooks = require('./wishes.hooks');
const filters = require('./wishes.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = false; // app.get('paginate');

  const options = {
    name: 'wishes',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/wishes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('wishes');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
