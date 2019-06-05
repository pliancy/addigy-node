![npm](https://img.shields.io/npm/v/addigy.svg?style=flat-square)

# Addigy API SDK for Node.JS

This package takes the Addigy public API and covers it into a consistent promise-based interface.


:warning: Use this at your own risk. To error is human, to propogate error across all of prod via API is DevOps.
 
 ----
 
 ## Getting Started
 
 You can install the package with the following command:
 ```
 npm install addigy
 ```
 
 You must import the package and pass in the `clientId` and `clientSecret` from addigy to the constructor, as so:
 ```js
 var Addigy = require('addigy')

let myAddigy = new Addigy({
  clientId: '52c6...',
  clientSecret: '8db7...'
})
 ```
 
 From there, you can call any of the `addigy` package functions (all of which are Promise-based) using `await` or with `=>` notation:
 ```js
 var policies

myAddigy.getPolicies().then(response => { policies = response })
 ```
 
 The response will be a JSON object or array, like so:
 
 ```js
 [ { color: '#8a4242',
    download_path:
     'https://prod.addigy.com/download/addigy_agent/ca13b.../d4c...',
    policyId: 'd4c...',
    parent: null,
    orgid: 'ca13b...',
    creation_time: 1555527090,
    name: 'Prod Policy',
    icon: 'fa fa-desktop' },
  { color: '#000000',
    download_path:
     'https://prod.addigy.com/download/addigy_agent/ca13b.../17b...',
    policyId: '17b...',
    parent: null,
    orgid: 'ca13b...',
    creation_time: 1557534783,
    name: 'Customer 2',
    icon: 'fa fa-university' },
  { color: '#00d000',
    download_path:
     'https://prod.addigy.com/download/addigy_agent/ca13b.../af4...',
    policyId: 'af4...',
    parent: null,
    orgid: 'ca13b...',
    creation_time: 1557880460,
    name: "Dev Policy",
    icon: 'fa fa-exchange' } ]
 ```

Don't forget to catch your promises.
