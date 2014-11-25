'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var plist = require('plist');
var unzip = require('unzip');

var rimraf = require('rimraf');
var tmp = require('temporary');
var glob = require("glob");

var output = new tmp.Dir();

var provisionFilename = 'Provisioning.plist';

module.exports = function (file, callback){
  var data = {};

  fs.createReadStream(file)
    .pipe(unzip.Extract({ path: output.path }))
    .on('close', function(){
      var path = glob.sync(output.path + '/Payload/*/')[0];

      data.metadata = plist.parse(fs.readFileSync(path + 'Info.plist', 'utf8'));

      if(!fs.existsSync(path + 'embedded.mobileprovision') || !which.sync('security')){
        return cleanUp();
      }
      exec('security cms -D -i embedded.mobileprovision > ' + provisionFilename, { cwd: path }, function(error) {
        if(error){
          cleanUp(error);
        }

        data.provisioning = plist.parse(fs.readFileSync(path + provisionFilename, 'utf8'));
        delete data.provisioning.DeveloperCertificates;


      });
    });

  function cleanUp(error){
    rimraf.sync(output.path);
    return callback(error, data);
  }
};
