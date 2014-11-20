# ipa-metadata-parser [![Build Status](http://img.shields.io/travis/matiassingers/ipa-metadata-parser.svg?style=flat-square)](https://travis-ci.org/matiassingers/ipa-metadata-parser) [![Dependency Status](http://img.shields.io/gemnasium/matiassingers/ipa-metadata-parser.svg?style=flat-square)](https://gemnasium.com/matiassingers/ipa-metadata-parser)
> extract metadata and provisioning information about an .ipa file

## Install

```sh
$ npm install --save ipa-metadata-parser
```


## Usage

```js
var ipaMetadataParser = require('ipa-metadata-parser');

ipaMetadataParser('Facebook.ipa', function(data){
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
$ npm install --global ipa-metadata-parser
```

```sh
$ ipa-metadata --help

  Example
    ipa-metadata Facebook.ipa
    
    ipa-metadata Facebook.ipa --verbose
    
```


## License

MIT © [Matias Singers](http://mts.io)
