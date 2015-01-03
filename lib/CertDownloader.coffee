# The MIT License (MIT)

# Copyright (c) Silas Knobel <dev@katun.ch> (http://katun.ch)

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.


class CertDownloader
    constructor: (@certName='AppleIncRootCertificate.cer') ->
        @fs = require 'fs'
        @http = require 'http'

    cert: (callback) ->
        @fs.exists __dirname + @certName, (exists) =>
            if exists is true
                callback __dirname + '/' + @certName
            else
                #download the cert
                downloadStream = @fs.createWriteStream __dirname + '/' + @certName

                @http.get 'http://www.apple.com/appleca/AppleIncRootCertificate.cer', (response) =>
                    response.pipe downloadStream
                    downloadStream.on 'finish', () =>
                        downloadStream.close () =>
                            callback __dirname + '/' + @certName

    pem: (callback) ->
        splits = @certName.split '.'
        pemFileName = splits[0] + '.pem'
        @fs.exists __dirname + '/' + pemFileName, (exists) =>
            if exists is true
                callback __dirname + '/' + pemFileName
            else
                @cert (certPath) =>
                    {exec} = require 'child_process'
                    execOptions =
                        cwd: __dirname

                    exec 'openssl x509 -inform der -in '+@certName+' -out ' + pemFileName, execOptions, (error) ->
                        if error is not undefined
                            callback undefined, error
                        else
                            callback __dirname + '/' + pemFileName

module.exports = CertDownloader
