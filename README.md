![npm](https://img.shields.io/npm/v/addigy.svg?style=flat-square)

# Addigy API SDK for Node.JS

This package takes the Addigy public API and wraps it into a consistent promise-based interface.

:warning: Use this at your own risk. To error is human, to propogate error across all of prod via API is DevOps.

---

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
    clientSecret: '8db7...',
})
```

From there, you can call any of the `addigy` package functions (all of which are Promise-based) using `await` or with `=>` notation:

```js
var policies

myAddigy.getPolicies().then((response) => {
    policies = response
})
```

The response will be a JSON object or array, like so:

```js
;[
    {
        color: '#8a4242',
        download_path: 'https://prod.addigy.com/download/addigy_agent/ca13b.../d4c...',
        policyId: 'd4c...',
        parent: null,
        orgid: 'ca13b...',
        creation_time: 1555527090,
        name: 'Prod Policy',
        icon: 'fa fa-desktop',
    },
    {
        color: '#000000',
        download_path: 'https://prod.addigy.com/download/addigy_agent/ca13b.../17b...',
        policyId: '17b...',
        parent: null,
        orgid: 'ca13b...',
        creation_time: 1557534783,
        name: 'Customer 2',
        icon: 'fa fa-university',
    },
    {
        color: '#00d000',
        download_path: 'https://prod.addigy.com/download/addigy_agent/ca13b.../af4...',
        policyId: 'af4...',
        parent: null,
        orgid: 'ca13b...',
        creation_time: 1557880460,
        name: 'Dev Policy',
        icon: 'fa fa-exchange',
    },
]
```

Don't forget to catch your promises.

---

## Advanced Usage

This wrapper supports some advanced functions such as user management, retreival of billing information, creation of ScreenConnect links, and management of API keys. These all rely on use of Addigy's internal API, which can change at any time without notice. Usage of this module is unsuported in general, but consider use of these endpoints as even less than unsuported. I actively discourage their use. With that disclaimer out of the way, here's how to use them:

Expand the Constructor's parameters to include the username and password of a user account at the partnr tenant level that has 'Owner' access, as so:

```js
var Addigy = require('addigy')

let myAddigy = new Addigy({
    clientId: '52c6...',
    clientSecret: '8db7...',
    adminUsername: 'hopefully_a_service_account@example.net',
    adminPassword: 'hunter2',
})
```

From there, call `myAddigy.getAuthObject()` to generate an authentication object that contains an auth token and other information needed by various internal calls. The auth object will look like so:

```js
{
  orgId: 'a4d7...',
  emailAddress: 'hopefully_a_service_account@example.net',
  authToken: '35a8...'
}
```

From there, you can pass that auth object to any of the internal API endpoints, like so:

```js
myAddigy
    .createUser(authObject, 'whateveryouwant@example.com', 'First Last', [], 'user')
    .then((result) => {
        console.log(result)
    })
    .catch((err) => {
        console.log(err) // actually handle your errors though
    })
```

If you are a partner that manages multiple independent Addigy tenants, you can easily run commands against your child tenants by calling the `getImpersonationAuthObject()` function. It will return a new authentication object pertinent to the given tenant that can be used on subsequent calls. An example of the workflow is as follows:

```js
let myAddigy = new Addigy({
    clientId: '52c6...',
    clientSecret: '8db7...',
    adminUsername: 'an_account_at_the_partner_level_with_owner_role@example.net',
    adminPassword: '...',
})

let partnerAuthObject = await myAddigy.getAuthObject()
let desiredTenantOrgId = '078b...'

let impersonationObject = await myAddigy.getImpersonationAuthObject(
    partnerAuthObject,
    desiredTenantOrgId,
)

// Now we have a new authentication object to call Addigy's API for a given tenant

await myAddigy.getUsers(impersonationObject)
```

Have fun.
