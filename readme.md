# ipa-metadata [![Build Status](http://img.shields.io/travis/matiassingers/ipa-metadata.svg?style=flat-square)](https://travis-ci.org/matiassingers/ipa-metadata) [![Dependency Status](http://img.shields.io/gemnasium/matiassingers/ipa-metadata.svg?style=flat-square)](https://gemnasium.com/matiassingers/ipa-metadata) [![Coverage Status](http://img.shields.io/coveralls/matiassingers/ipa-metadata.svg?style=flat-square)](https://coveralls.io/r/matiassingers/ipa-metadata)

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/matiassingers/ipa-metadata?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
> extract metadata and provisioning information about an .ipa file

Inspired by the `ipa info` in [`shenzhen`](https://github.com/nomad/shenzhen/blob/master/lib/shenzhen/commands/info.rb), but I wanted more general metadata information about the `.ipa`.
I created a [quick Bash script](https://gist.github.com/matiassingers/47663489189abfc8b2a9), but thought I could do a better job with a small NodeJS module.

The CLI is very useful for quickly checking the entitlements of an `.ipa` file (`--verify`), and two types will be returned from the module:
  - `.app` bundle with [`codesign`](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/codesign.1.html)
  - `embedded.mobileprovision` with [`security`](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/security.1.html)
  
See ["Checking the Entitlements of an .ipa file"](https://developer.apple.com/library/ios/qa/qa1798/_index.html#//apple_ref/doc/uid/DTS40014167-CH1-INSPECT_IPA) for more information

## Install

```sh
$ npm install --save ipa-metadata
```


## Usage

```js
var ipaMetadata = require('ipa-metadata');

ipaMetadata('Facebook.ipa', function(data){
  console.log(data);
  
  // { metadata: 
  //    { CFBundleName: 'Facebook',
  //      ... },
  //   provisioning:
  //    { TeamName: 'Facebook Inc.',
  //      ... } },
  //   entitlements:
  //    { application-identifier: '1234abcd.com.facebook.facebook.',
  //      ... } }
});
```


## CLI

```sh
$ npm install --global ipa-metadata
```

```sh
$ ipa-metadata --help

  Example
    ipa-metadata Facebook.ipa
    
    ipa-metadata Facebook.ipa --verbose
    
    ipa-metadata Facebook.ipa --verify
    (verifies entitlements between `.app` bundle and `embedded.mobileprovision`)
```


## License

MIT © [Matias Singers](http://mts.io)
