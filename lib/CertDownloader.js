/*
  downloads the apple inc root certificate if it isn't already present
*/

'use strict';


var CertDownloader;

CertDownloader = (function() {
  function CertDownloader(certName) {
    this.certName = certName != null ? certName : 'AppleIncRootCertificate.cer';
    this.fs = require('fs');
    this.http = require('http');
  }

  CertDownloader.prototype.cert = function(callback) {
    return this.fs.exists(__dirname + this.certName, (function(_this) {
      return function(exists) {
        var downloadStream;
        if (exists === true) {
          return callback(__dirname + '/' + _this.certName);
        } else {
          downloadStream = _this.fs.createWriteStream(__dirname + '/' + _this.certName);
          return _this.http.get('http://www.apple.com/appleca/AppleIncRootCertificate.cer', function(response) {
            response.pipe(downloadStream);
            return downloadStream.on('finish', function() {
              return downloadStream.close(function() {
                return callback(__dirname + '/' + _this.certName);
              });
            });
          });
        }
      };
    })(this));
  };

  CertDownloader.prototype.pem = function(callback) {
    var pemFileName, splits;
    splits = this.certName.split('.');
    pemFileName = splits[0] + '.pem';
    return this.fs.exists(__dirname + '/' + pemFileName, (function(_this) {
      return function(exists) {
        if (exists === true) {
          return callback(__dirname + '/' + pemFileName);
        } else {
          return _this.cert(function(certPath) {
            var exec, execOptions;
            exec = require('child_process').exec;
            execOptions = {
              cwd: __dirname
            };
            return exec('openssl x509 -inform der -in ' + _this.certName + ' -out ' + pemFileName, execOptions, function(error) {
              if (error === !void 0) {
                return callback(void 0, error);
              } else {
                return callback(__dirname + '/' + pemFileName);
              }
            });
          });
        }
      };
    })(this));
  };

  return CertDownloader;

})();

module.exports = CertDownloader;
