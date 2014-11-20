'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var plist = require('plist');
var unzip = require('unzip');

var rimraf = require('rimraf');
var tmp = require('temporary');
var glob = require("glob");

var output = new tmp.Dir();

module.exports = function (file, callback){
  fs.createReadStream(file)
    .pipe(unzip.Extract({ path: output.path }))
    .on('close', function(){
      var path = glob.sync(output.path + '/Payload/*/')[0];

      var metadata = plist.parse(fs.readFileSync(path + 'Info.plist', 'utf8'));

      exec('security cms -D -i embedded.mobileprovision > Provisioning.plist', { cwd: path }, function(error) {
        if(error){
          throw error;
        }

        var provisioning = plist.parse(fs.readFileSync(path + 'Provisioning.plist', 'utf8'));
        delete provisioning.DeveloperCertificates;

        rimraf.sync(output.path);

        return callback({
          metadata: metadata,
          provisioning: provisioning
        });
      });
    });
};
