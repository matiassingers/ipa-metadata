# ipa-metadata [![Build Status](http://img.shields.io/travis/matiassingers/ipa-metadata.svg?style=flat-square)](https://travis-ci.org/matiassingers/ipa-metadata) [![Dependency Status](http://img.shields.io/gemnasium/matiassingers/ipa-metadata.svg?style=flat-square)](https://gemnasium.com/matiassingers/ipa-metadata)
> extract metadata and provisioning information about an .ipa file

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
    
```


## License

MIT © [Matias Singers](http://mts.io)
