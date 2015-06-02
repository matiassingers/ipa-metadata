'use strict';

var async = require('async');
var plist = require('simple-plist');
var decompress = require('decompress-zip');
var provisioning = require('provisioning');
var entitlements = require('entitlements');

var rimraf = require('rimraf');
var tmp = require('temporary');
var glob = require("glob");

var output = new tmp.Dir();

module.exports = function (file, callback){
  var data = {};

  var unzipper = new decompress(file);
  unzipper.extract({
    path: output.path
  });

  unzipper.on('error', cleanUp);
  unzipper.on('extract', function() {
    var path = glob.sync(output.path + '/Payload/*/')[0];

    data.metadata = plist.readFileSync(path + 'Info.plist');

    async.parallel([
      async.apply(provisioning, path + 'embedded.mobileprovision'),
      async.apply(entitlements, path)
    ], function(error, results){
      if(error){
        return cleanUp(error);
      }

      data.provisioning = results[0];

      // Hard to serialize and it looks messy in output
      delete data.provisioning.DeveloperCertificates;

      data.entitlements = results[1];

      return cleanUp();
    });
  });

  function cleanUp(error){
    rimraf.sync(output.path);
    return callback(error, data);
  }
};
