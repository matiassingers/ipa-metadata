/*
The MIT License (MIT)

Copyright (c) Silas Knobel <dev@katun.ch> (http://katun.ch)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
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
