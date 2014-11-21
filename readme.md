# ipa-metadata [![Build Status](http://img.shields.io/travis/matiassingers/ipa-metadata.svg?style=flat-square)](https://travis-ci.org/matiassingers/ipa-metadata) [![Dependency Status](http://img.shields.io/gemnasium/matiassingers/ipa-metadata.svg?style=flat-square)](https://gemnasium.com/matiassingers/ipa-metadata)
> extract metadata and provisioning information about an .ipa file

Inspired by the `ipa info` in [`shenzhen`](https://github.com/nomad/shenzhen/blob/master/lib/shenzhen/commands/info.rb), but I wanted more general metadata information about the `.ipa`.
I created a [quick Bash script](https://gist.github.com/matiassingers/47663489189abfc8b2a9), but thought I could do a better job with a small NodeJS module.


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
