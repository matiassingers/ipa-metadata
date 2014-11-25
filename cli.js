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

function format(value) {
  if(!_.isPlainObject(value)) {
    return value;
  }

  var string = [];
  _.each(value, function(value, key) {
    string.push(key, ': ', format(value), '\n');
  });
  string.pop();

  return string.join('');
}

function verboseFormatting(data){
  var types = Object.keys(data);

  _.each(types, function(type){
    var table = new Table();
    _.each(data[type], function(value, key){
      table.push([key, format(value)]) ;
    });

    console.log(table.toString());
  });
}

if(!cli.input[0]){
  return cli.showHelp();
}

ipaMetadata(cli.input[0], function(error, data){
  if(error){
    return console.log(error.message);
  }

  if(cli.flags.verbose){
    return verboseFormatting(data);
  }

  var types = {
    metadata: ['CFBundleDisplayName', 'CFBundleIdentifier', 'CFBundleShortVersionString', 'CFBundleVersion'],
    provisioning: ['Name', 'TeamIdentifier', 'TeamName', 'Entitlements']
  };

  var table = new Table();
  _.each(types, function(keys, type) {
    if(data[type]){
      _.each(keys, function(key) {
        var value = data[type][key];

        if(type === 'provisioning' && cli.flags.verify){
          var match = _.isEqual(data.provisioning[key], data.entitlements[key]);
          key = key + chalk[match ? 'green' : 'red'](' (' + match + ')');
        }

        table.push([key, format(value)]);
      });
    }
  });

  console.log(table.toString());
});
