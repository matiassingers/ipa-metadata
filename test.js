'use strict';

var assert = require('assert');
var ipaMetadataParser = require('./');

describe('should parse .ipa file', function(){
  var error, output;

  beforeEach(function(done) {
    ipaMetadataParser('tests/fixtures/testApp.ipa', function(err, data) {
      error = err;
      output = data;

      done();
    });
  });

  it('error should not be set', function() {
    assert.equal(error, void 0);
  });

  it('should contain the correct data', function() {
    assert.equal(output.metadata['CFBundleDisplayName'], 'Test App');
    assert.equal(output.metadata['CFBundleIdentifier'], 'io.mts.testapp');
    assert.equal(output.metadata['CFBundleName'], 'Test App');
    assert.equal(output.metadata['CFBundleShortVersionString'], '1.0.0');
    assert.equal(output.metadata['CFBundleVersion'], '1337');
  });
});
