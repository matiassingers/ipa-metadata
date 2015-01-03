#!/usr/bin/env node

'use strict';

var pkg = require('./package.json');
var ipaMetadata = require('./');
var meow = require('meow');

var Table = require('cli-table');
var _ = require('lodash');
var chalk = require('chalk');

var cli = meow({
    help: [
        'Example',
        '  ipa-metadata Facebook.ipa',
        '',
        '  ipa-metadata Facebook.ipa --verbose',
        '',
        '  ipa-metadata Facebook.ipa --verify',
        '  (verifies entitlements between `.app` bundle and `embedded.mobileprovision`)',
        '',
        '  => data displayed in a table'
    ].join('\n')
});

function format(value, compare) {
    if (!_.isPlainObject(value)) {
        return value;
    }

    var string = [];
    _.each(value, function(value, key) {
        var shouldCompareEquality = cli.flags.verify && compare;

        if (shouldCompareEquality && (key === 'keychain-access-groups')) {
            return string.push(compareKeychainEntitlement(value, key, compare[key]), '\n');
        }

        if (shouldCompareEquality) {
            var match = value === compare[key];
            var stringResult = chalk[match ? 'green' : 'red'](key + ': ' + format(value));
            return string.push(stringResult, '\n');
        }

        string.push(key, ': ', format(value), '\n');
    });
    string.pop();

    return string.join('');
}

function compareKeychainEntitlement(value, key, compare) {
    function splitKeychain(value) {
        return value[0].split('.')[0];
    }

    var match = splitKeychain(value) === splitKeychain(compare);
    return chalk[match ? 'green' : 'red'](key + ': ' + format(value));
}

function verboseFormatting(data) {
    var types = Object.keys(data);

    _.each(types, function(type) {
        var table = new Table();
        _.each(data[type], function(value, key) {
            table.push([key, format(value)]);
        });

        console.log(table.toString());
    });
}

if (!cli.input[0]) {
    return cli.showHelp();
}

ipaMetadata(cli.input[0], function(error, data) {
    if (error) {
        return console.log(error.message);
    }

    if (cli.flags.verbose) {
        return verboseFormatting(data);
    }

    var types = {
        metadata: ['CFBundleDisplayName', 'CFBundleIdentifier', 'CFBundleShortVersionString', 'CFBundleVersion'],
        provisioning: ['Name', 'TeamIdentifier', 'TeamName', 'CreationDate', 'ExpirationDate', 'Entitlements']
    };

    var table = new Table();
    _.each(types, function(keys, type) {
        if (data[type]) {
            _.each(keys, function(key) {
                var value = data[type][key];
                table.push([key, format(value, data.entitlements)]);
            });
        }
    });

    console.log(table.toString());
});
