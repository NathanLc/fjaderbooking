const assert = require('assert');
const sanitizeCreateWish = require('../../src/hooks/sanitize-create-wish');

describe('\'sanitize-create-wish\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    // Initialize our hook with no options
    const hook = sanitizeCreateWish();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
