

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
