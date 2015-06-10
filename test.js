'use strict';

var assert = require('assert');
var proxyquire =  require('proxyquire');



var ipaMetadataParser = proxyquire('./', {
  provisioning: function provisioningStub(file, callback) {
    callback(null, {
      key: 'lol',
      DeveloperCertificates: 'whatever'
    });
  },
  entitlements: function entitlementsStub(file, callback) {
    callback(null, {
      anotherKey: 'test'
    });
  }
});

describe('ipa-metadata', function() {
  describe('should not contain entitlements on fake platform', function() {
    beforeEach(function() {
      this.originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'MockOS'
      });
    });

    describe('should parse .ipa file', function() {
      it('should contain the correct data', function(done) {
        ipaMetadataParser('tests/fixtures/testApp.ipa', function(err, data) {
          assert.equal(err, void 0);

          assert.equal(data.metadata['CFBundleDisplayName'], 'Test App');
          assert.equal(data.metadata['CFBundleIdentifier'], 'io.mts.testapp');
          assert.equal(data.metadata['CFBundleName'], 'Test App');
          assert.equal(data.metadata['CFBundleShortVersionString'], '1.0.0');
          assert.equal(data.metadata['CFBundleVersion'], '1337');

          assert.deepEqual(data.provisioning, {key: 'lol'});
          assert.equal(data.entitlements, void 0);

          done();
        });
      });
    });

    describe('should parse .ipa files with binary .plist files', function() {
      it('should contain the correct data', function(done) {
        ipaMetadataParser('tests/fixtures/testApp-binaryPlist.ipa', function(err, data) {
          assert.equal(err, void 0);

          assert.equal(data.metadata['CFBundleDisplayName'], 'Test App');
          assert.equal(data.metadata['CFBundleIdentifier'], 'io.mts.testapp');
          assert.equal(data.metadata['CFBundleName'], 'Test App');
          assert.equal(data.metadata['CFBundleShortVersionString'], '1.0.0');
          assert.equal(data.metadata['CFBundleVersion'], '1337');

          assert.deepEqual(data.provisioning, {key: 'lol'});
          assert.equal(data.entitlements, void 0);

          done();
        });
      });
    });

    afterEach(function() {
      Object.defineProperty(process, 'platform', {
        value: this.originalPlatform
      });
    });
  });

  describe('should contain entitlements on OS X platform', function() {
    beforeEach(function() {
      this.originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'darwin'
      });
    });

    it('should contain the correct data', function(done) {
      ipaMetadataParser('tests/fixtures/testApp-binaryPlist.ipa', function(err, data) {
        assert.equal(err, void 0);

        assert.equal(data.metadata['CFBundleDisplayName'], 'Test App');
        assert.equal(data.metadata['CFBundleIdentifier'], 'io.mts.testapp');
        assert.equal(data.metadata['CFBundleName'], 'Test App');
        assert.equal(data.metadata['CFBundleShortVersionString'], '1.0.0');
        assert.equal(data.metadata['CFBundleVersion'], '1337');

        assert.deepEqual(data.provisioning, {key: 'lol'});
        assert.deepEqual(data.entitlements, {anotherKey: 'test'});

        done();
      });
    });

    afterEach(function() {
      Object.defineProperty(process, 'platform', {
        value: this.originalPlatform
      });
    });
  });

  describe('should handle parsing errors', function() {
    beforeEach(function() {
      ipaMetadataParser = proxyquire('./', {
        provisioning: function provisioningStub(file, callback) {
          callback('fake error');
        }
      });
    });

    it('should contain the correct data', function(done) {
      ipaMetadataParser('tests/fixtures/testApp-binaryPlist.ipa', function(err, data) {
        assert.equal(err, 'fake error');

        assert.equal(data.metadata['CFBundleDisplayName'], 'Test App');
        assert.equal(data.metadata['CFBundleIdentifier'], 'io.mts.testapp');
        assert.equal(data.metadata['CFBundleName'], 'Test App');
        assert.equal(data.metadata['CFBundleShortVersionString'], '1.0.0');
        assert.equal(data.metadata['CFBundleVersion'], '1337');

        assert.equal(data.provisioning, void 0);
        assert.equal(data.entitlements, void 0);

        done();
      });
    });
  });
});
