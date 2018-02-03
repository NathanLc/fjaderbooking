const assert = require('assert');
const app = require('../../src/app');

describe('\'wishes\' service', () => {
  it('registered the service', () => {
    const service = app.service('wishes');

    assert.ok(service, 'Registered the service');
  });
});
