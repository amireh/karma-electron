// Load in our dependencies
var assert = require('assert');
// TODO: Fix support for loading `./submodule`
var submodule = require('/home/todd/github/karma-electron-launcher2/test/integration-test/submodule');

// Start our tests
describe('All node integrations', function () {
  it('exist as expected', function () {
    assert(require);
    assert(module);
    // Example: /home/todd/github/karma-electron-launcher/test/integration-test/node-test.js
    assert(/test\/integration-test\/node-test\.js$/.test(__filename),
      'Expected "' + __filename + '" to end with "test/integration-test/node-test.js"');
    assert.strictEqual(/^\/base\//.test(__filename), false,
      'Expected "' + __filename + '" to not start with "base"');
    // Example: /home/todd/github/karma-electron-launcher/test/integration-test
    assert(/test\/integration-test$/.test(__dirname),
      'Expected "' + __dirname + '" to end with "test/integration-test"');
    assert.strictEqual(/^\/base\//.test(__dirname), false,
      'Expected "' + __dirname + '" to not start with "base"');
    assert(process);
    assert(setImmediate);
    assert(clearImmediate);
    assert.strictEqual(global, window);
  });
});

describe('module', function () {
  describe('in the top level', function () {
    // DEV: Determined exepctations via https://gist.github.com/twolfson/c6213aa59f7c3f6477a7
    it('identify as the page itself', function () {
      // TODO: Remedy this...
      // assert.strictEqual(module.filename, 'wat');
      assert.strictEqual(typeof module.exports, 'object');
      assert.strictEqual(module.id, '.');
      assert.strictEqual(submodule.loaded, true);
      assert.strictEqual(module.parent, null);
    });
  });

  describe('in a child module', function () {
    // DEV: Determined exepctations via https://gist.github.com/twolfson/c6213aa59f7c3f6477a7
    it('identify as a standalone module', function () {
      assert(/test\/integration-test\/submodule\.js$/.test(submodule.filename),
        'Expected "' + submodule.filename + '" to end with "test/integration-test/submodule.js"');
      assert.strictEqual(submodule.exports.hello, 'world');
      assert(/test\/integration-test\/submodule\.js$/.test(submodule.id),
        'Expected "' + submodule.id + '" to end with "test/integration-test/submodule.js"');
      assert.strictEqual(submodule.loaded, true);
      assert.strictEqual(submodule.parent, module);
    });
  });
});

describe('setImmediate', function () {
  it('runs before `setTimeout`', function (done) {
    // Set up a setImmediate
    var setImmediateRan = false;
    setImmediate(function handleSetImmediate () {
      setImmediateRan = true;
    });

    // Set up a setTimeout to assert and callback
    setTimeout(function handleSetTimeout () {
      assert.strictEqual(setImmediateRan, true);
      done();
    }, 100);
  });
});

describe('clearImmediate', function () {
  it('clears an existing `setImmediate`', function (done) {
    // Set up a setImmediate
    var setImmediateRan = false;
    var setImmediateId = setImmediate(function handleSetImmediate () {
      setImmediateRan = true;
    });

    // Set up a setTimeout to assert and callback
    setTimeout(function handleSetTimeout () {
      assert.strictEqual(setImmediateRan, false);
      done();
    }, 100);

    // Clear our setImmediate
    clearImmediate(setImmediateId);
  });
});
