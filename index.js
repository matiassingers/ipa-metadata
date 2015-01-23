'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var plist = require('simple-plist');
var decompress = require('decompress-zip');
var which = require('which');
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

    if(!fs.existsSync(path + 'embedded.mobileprovision')){
      return cleanUp();
    }

    provisioning(path + 'embedded.mobileprovision', function(error, provision){
      if(error){
        return cleanUp(error);
      }

      data.provisioning = provision;
      delete data.provisioning.DeveloperCertificates;

      if(!which.sync('codesign')){
        return cleanUp();
      }

      entitlements(path, function(error, entitlement) {
        data.entitlements = entitlement;

        return cleanUp();
      });
    });
  });

  function cleanUp(error){
    rimraf.sync(output.path);
    return callback(error, data);
  }
};
