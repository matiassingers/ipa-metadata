#!/usr/bin/env node
'use strict';

var pkg = require('./package.json');
var ipaMetadata = require('./');
var meow = require('meow');

var Table = require('cli-table');
var _ = require('lodash');

var cli = meow({
  help: [
    'Example',
    '  ipa-metadata Facebook.ipa',
    '',
    '  ipa-metadata Facebook.ipa --verbose',
    '',
    '  => ┌────────────────────────────┬───────────────────────────────────────────────────────────┐',
    '     │ CFBundleDisplayName        │ Facebook                                                  │',
    '     ├────────────────────────────┼───────────────────────────────────────────────────────────┤',
    '     │ CFBundleIdentifier         │ com.facebook.facebook                                     │',
    '     ├────────────────────────────┼───────────────────────────────────────────────────────────┤',
    '     │ CFBundleShortVersionString │ 18.1                                                      │',
    '     ├────────────────────────────┼───────────────────────────────────────────────────────────┤',
    '     │ CFBundleVersion            │ 1337                                                      │',
    '     ├────────────────────────────┼───────────────────────────────────────────────────────────┤',
    '     │ Name                       │ Facebook                                                  │',
    '     ├────────────────────────────┼───────────────────────────────────────────────────────────┤',
    '     │ TeamIdentifier             │ 1234ABCD56                                                │',
    '     ├────────────────────────────┼───────────────────────────────────────────────────────────┤',
    '     │ TeamName                   │ Facebook Inc.                                             │',
    '     ├────────────────────────────┼───────────────────────────────────────────────────────────┤',
    '     │ Entitlements               │ application-identifier: 1234ABCD56.com.facebook.facebook  │',
    '     │                            │ aps-environment: production                               │',
    '     │                            │ get-task-allow: false                                     │',
    '     │                            │ keychain-access-groups: 1234ABCD56.*                      │',
    '     └────────────────────────────┴───────────────────────────────────────────────────────────┘'
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
  _.each(types, function(keys, index) {
    if(data[index]){
      _.each(keys, function(key) {
        var value = data[index][key];
        table.push([key, format(value)]);
      });
    }
  });

  console.log(table.toString());
});
