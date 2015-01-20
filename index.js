'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var plist = require('plist');
var decompress = require('decompress-zip');
var which = require('which');

var rimraf = require('rimraf');
var tmp = require('temporary');
var glob = require("glob");

var output = new tmp.Dir();

var provisionFilename = 'Provisioning.plist';
var CertDownloader = require('./lib/CertDownloader.js')

module.exports = function(file, callback) {
    var data = {};

    var unzipper = new decompress(file);
    unzipper.extract({
        path: output.path
    });

    unzipper.on('error', cleanUp);
    unzipper.on('extract', function() {
        var path = glob.sync(output.path + '/Payload/*/')[0];

        data.metadata = plist.parse(fs.readFileSync(path + 'Info.plist', 'utf8'));

        if (!fs.existsSync(path + 'embedded.mobileprovision') || !which.sync('openssl')) {
            return cleanUp();
        }

        var cert = new CertDownloader()
        cert.pem(function (pemPath, error) {
          if (error) {
            cleanUp(error);
          }

          exec('openssl smime -in embedded.mobileprovision -inform der -verify -CAfile '+ pemPath +' > ' + provisionFilename, {
              cwd: path
          }, function(error) {
              if (error) {
                  cleanUp(error);
              }

              data.provisioning = plist.parse(fs.readFileSync(path + provisionFilename, 'utf8'));
              delete data.provisioning.DeveloperCertificates;

              try {
                if (!which.sync('codesign')) {
                    return cleanUp();
                }

                exec('codesign -d --entitlements :- ' + path, function(error, output) {
                    data.entitlements = plist.parse(output);

                    return cleanUp();
                });
              }
              catch (e) {
              }
              finally {
                cleanUp()
              }

          });
        });
    });

    function cleanUp(error) {
        rimraf.sync(output.path);
        return callback(error, data);
    }
};
