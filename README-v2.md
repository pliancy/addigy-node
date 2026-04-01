# Addigy API v2

The `AddigyV2` class provides access to Addigy's v2 API. It authenticates via a single API key (no `clientId`/`clientSecret` pair required) and exposes namespaced sub-clients for each resource area.

---

## Setup

```ts
import { AddigyV2 } from 'addigy'

const addigy = new AddigyV2({ apiKey: 'your-api-key' })
```

---

## Modules

- [`addigy.certs`](#certs) — Installed MDM certificates
- [`addigy.customFacts`](#custom-facts) — Custom facts
- [`addigy.devices`](#devices) — Device audits and facts
- [`addigy.mdmConfigurations`](#mdm-configurations) — MDM configuration profiles
- [`addigy.policies`](#policies) — Policies
- [`addigy.smartSoftware`](#smart-software) — Smart software
- [`addigy.users`](#users) — Organization users

---

## Pagination

List methods that support pagination accept a `V2ListOptions` object:

| Option          | Type                | Default | Description                                      |
|-----------------|---------------------|---------|--------------------------------------------------|
| `page`          | `number`            | `1`     | Starting page number                             |
| `perPage`       | `number`            | `100`   | Items per page                                   |
| `sortField`     | `string`            | —       | Field name to sort by                            |
| `sortDirection` | `'asc'` \| `'desc'` | —       | Sort direction                                   |
| `paginate`      | `boolean`           | `true`  | When `true`, automatically fetches all pages     |

Set `paginate: false` to retrieve only a single page.

```ts
// Get only the first 25 devices, no auto-pagination
const devices = await addigy.devices.list({ page: 1, perPage: 25, paginate: false })
```

---

## Certs

Access via `addigy.certs`.

### `list(options?)`

Returns all installed MDM certificates across devices.

```ts
const certs = await addigy.certs.list()
```

**Returns:** `InstalledCertificate[]`

| Field               | Type       | Description                        |
|---------------------|------------|------------------------------------|
| `cert_org_name`     | `string`   | Certificate organization name      |
| `common_name`       | `string`   | Certificate common name            |
| `device_uuid`       | `string`   | UUID of the device                 |
| `is_identity`       | `boolean`  | Whether it is an identity cert     |
| `issuer_common_name`| `string`   | Issuer's common name               |
| `not_after`         | `string`   | Expiration date                    |
| `not_before`        | `string`   | Issuance date                      |
| `user_id`           | `string`   | Associated user ID                 |
| `version`           | `number`   | Certificate version                |

---

## Custom Facts

Access via `addigy.customFacts`.

### `list(options?)`

Returns all custom facts. Supports an optional `filter` in addition to standard pagination options.

```ts
const facts = await addigy.customFacts.list({
  filter: { name_contains: 'disk' },
})
```

**Filter options (`CustomFactsFilter`):**

| Field          | Type       | Description                        |
|----------------|------------|------------------------------------|
| `ids`          | `string[]` | Filter by specific fact IDs        |
| `name_contains`| `string`   | Filter by name substring           |

**Returns:** `CustomFact[]`

### `get(organizationId, id)`

Fetches a single custom fact by ID.

```ts
const fact = await addigy.customFacts.get('org-id', 'fact-id')
```

### `getUsage(organizationId, id)`

Returns where a custom fact is used (policies, alerts, reports, integrations, user configs).

```ts
const usage = await addigy.customFacts.getUsage('org-id', 'fact-id')
```

**Returns:** `CustomFactUsage`

### `create(organizationId, request)`

Creates a new custom fact.

```ts
const result = await addigy.customFacts.create('org-id', {
  name: 'My Fact',
  return_type: 'string',
  notes: 'Optional description',
  os_architectures: {
    macOS: {
      script: 'echo "hello"',
      language: 'bash',
      shebang: '#!/bin/bash',
    },
  },
})
```

**Returns:** `CreateCustomFactResponse` — contains both the `fact` and `instruction` objects.

### `update(organizationId, request)`

Updates an existing custom fact by ID.

```ts
await addigy.customFacts.update('org-id', {
  id: 'fact-id',
  name: 'Updated Name',
})
```

### `delete(organizationId, id)`

Deletes a custom fact.

```ts
await addigy.customFacts.delete('org-id', 'fact-id')
```

### `assignPolicies(organizationId, id, policies)`

Assigns a custom fact to one or more policies.

```ts
const result = await addigy.customFacts.assignPolicies('org-id', 'fact-id', [
  'policy-id-1',
  'policy-id-2',
])
// result.succeeded: string[]
// result.failed: string[]
```

### `unassignPolicy(organizationId, id, policyId)`

Removes a custom fact from a single policy.

```ts
await addigy.customFacts.unassignPolicy('org-id', 'fact-id', 'policy-id')
```

---

## Devices

Access via `addigy.devices`.

### `list(options?)`

Returns device audit records including all collected facts.

```ts
const devices = await addigy.devices.list()
```

**Returns:** `DeviceAudit[]`

| Field             | Type          | Description                              |
|-------------------|---------------|------------------------------------------|
| `agentid`         | `string`      | Unique Addigy agent identifier           |
| `orgid`           | `string`      | Organization ID                          |
| `audit_date`      | `string`      | Date of the last audit                   |
| `agent_audit_date`| `string`      | Date of the last agent audit             |
| `facts`           | `DeviceFacts` | All collected device facts               |

`DeviceFacts` is a large object with typed fields for every fact Addigy collects. Common fields include:

| Fact                     | Type      | Description                         |
|--------------------------|-----------|-------------------------------------|
| `serial_number`          | `string`  | Device serial number                |
| `device_name`            | `string`  | Device name                         |
| `os_version`             | `string`  | macOS/iOS version                   |
| `online`                 | `boolean` | Whether the device is online        |
| `filevault_enabled`      | `boolean` | FileVault status                    |
| `has_mdm`                | `boolean` | Whether MDM is installed            |
| `free_disk_space_gb`     | `number`  | Free disk in gigabytes              |
| `battery_percentage`     | `number`  | Battery level                       |
| `last_online`            | `date`    | Last seen timestamp                 |
| `policy_ids`             | `list`    | All policies assigned to the device |

---

## MDM Configurations

Access via `addigy.mdmConfigurations`.

### Raw API Methods

#### `list()`

Returns all MDM configuration profiles in the organization.

```ts
const configs = await addigy.mdmConfigurations.list()
```

#### `get(payloadGroupId)`

Returns a single configuration profile by its group ID.

```ts
const config = await addigy.mdmConfigurations.get('group-id')
```

#### `create(payloads)`

Creates a new configuration profile from an array of raw payload objects.

```ts
const result = await addigy.mdmConfigurations.create([
  {
    payload_display_name: 'My Profile',
    payload_type: 'com.apple.wifi.managed',
    // ...payload-specific keys
  },
])
```

#### `createCustomProfile(profile, options?)`

Uploads a raw `.mobileconfig` file (as a `Buffer` or `string`).

```ts
import fs from 'fs'
const profile = fs.readFileSync('my-profile.mobileconfig')
const result = await addigy.mdmConfigurations.createCustomProfile(profile, {
  macos_minimum_version: '13.0',
})
```

#### `updatePayloads(payloads)`

Updates existing payloads within a configuration profile.

#### `delete(payloadGroupId)`

Deletes a configuration profile by its group ID.

#### `assignPolicies(groupId, policyIds)`

Assigns a configuration profile to one or more policies.

```ts
await addigy.mdmConfigurations.assignPolicies('group-id', ['policy-id-1', 'policy-id-2'])
```

#### `unassignPolicies(groupId, policyIds)`

Removes a configuration profile from one or more policies.

#### `listDefinitions()`

Returns all available MDM payload type definitions (manifests).

#### `getDefinition(addigyPayloadType)`

Returns the manifest for a specific payload type.

#### `listByPolicyAndType(policyId, payloadType)`

Returns all payload results for a given policy and payload type combination.

#### `queryPayloads(organizationId, request?)`

Queries payloads for a specific organization, optionally filtering by `payload_group_ids` or `excluded_payload_group_ids`.

---

### Helper Methods

These methods construct well-formed payloads and call `create()` automatically.

#### `createKernelExtensionPolicy(name, allowOverrides, kernelExtensions)`

```ts
await addigy.mdmConfigurations.createKernelExtensionPolicy('My KExt Policy', true, {
  allowedTeamIdentifiers: ['TEAM123'],
  allowedKernelExtensions: [
    { teamIdentifier: 'TEAM123', bundleIdentifiers: ['com.example.kext'] },
  ],
})
```

#### `createSystemExtensionPolicy(name, allowOverrides, systemExtensions)`

```ts
await addigy.mdmConfigurations.createSystemExtensionPolicy('My SysExt Policy', false, {
  allowedSystemExtensions: [
    { teamIdentifier: 'TEAM123', bundleIdentifiers: ['com.example.ext'] },
  ],
  allowedTeamIdentifiers: ['TEAM123'],
})
```

#### `createNotificationSettingsPolicy(name, notificationSettings)`

```ts
await addigy.mdmConfigurations.createNotificationSettingsPolicy('Notification Policy', [
  {
    bundle_identifier: 'com.example.app',
    notifications_enabled: true,
    // ...
  },
])
```

#### `createServiceManagementPolicy(name, rules, priority?)`

```ts
await addigy.mdmConfigurations.createServiceManagementPolicy('Service Mgmt', [
  { rule_type: 'label', value: 'com.example.daemon', comment: '' },
])
```

#### `createWebContentFilterPolicy(name, webContentPayload, priority?)`

```ts
await addigy.mdmConfigurations.createWebContentFilterPolicy('Web Filter', {
  filter_data_provider_bundle_identifier: 'com.example.filter',
  filter_data_provider_designated_requirement: 'anchor apple ...',
})
```

#### `createFilevaultPolicy(name, filevault, payloadPriority?)`

```ts
await addigy.mdmConfigurations.createFilevaultPolicy('FileVault Policy', {
  enable: true,
  defer: true,
  showRecoveryKey: false,
  escrowRecoveryKey: true,
})
```

| Option                                  | Type      | Description                                        |
|-----------------------------------------|-----------|----------------------------------------------------|
| `enable`                                | `boolean` | Enable FileVault                                   |
| `defer`                                 | `boolean` | Defer enabling until next login                    |
| `showRecoveryKey`                       | `boolean` | Show recovery key to the user                      |
| `escrowRecoveryKey`                     | `boolean` | Escrow key to Addigy's secure database             |
| `deferDontAskAtUserLogout`              | `boolean` | Don't ask at logout if deferring                   |
| `deferForceAtUserLoginMaxBypassAttempts`| `number`  | Max bypass attempts before forcing enable at login |
| `destroyFvKeyOnStandby`                 | `boolean` | Destroy FileVault key on standby                   |

#### `createPPPCPolicy(name, pppcPolicy)`

Creates a Privacy Preferences Policy Control (PPPC / TCC) profile.

```ts
await addigy.mdmConfigurations.createPPPCPolicy('My PPPC Policy', [
  {
    identifier: 'com.example.app',
    codeRequirement: 'anchor apple generic and ...',
    services: [
      { service: 'address_book', identifierType: 'bundleID', allowed: true },
      {
        service: 'screen_capture',
        identifierType: 'bundleID',
        authorization: 'AllowStandardUserToSetSystemService',
      },
      {
        service: 'apple_events',
        identifierType: 'bundleID',
        allowed: true,
        aeReceiverIdentifier: 'com.microsoft.Powerpoint',
        aeReceiverIdentifierType: 'bundleID',
        aeReceiverCodeRequirement: 'identifier "com.microsoft.Powerpoint...',
      },
    ],
  },
])
```

#### `createMdmCertificate(mdmConfigurationInput)`

Creates a certificate payload (e.g. a root CA certificate).

#### `createMdmProfile(mdmProfile)`

Low-level helper — pass one or more raw `MdmPayloadRequest` objects directly to `create()`.

---

## Policies

Access via `addigy.policies`.

### `list(policies?)`

Returns all policies, or a filtered subset by policy ID.

```ts
// All policies
const all = await addigy.policies.list()

// Specific policies
const subset = await addigy.policies.list(['policy-id-1', 'policy-id-2'])
```

**Returns:** `V2Policy[]`

| Field      | Type     | Description                    |
|------------|----------|--------------------------------|
| `policyId` | `string` | Unique policy identifier       |
| `orgid`    | `string` | Organization ID                |
| `name`     | `string` | Policy name                    |
| `color`    | `string` | Policy color hex code          |
| `icon`     | `string` | FontAwesome icon class         |
| `parent`   | `string` | Parent policy ID (if nested)   |

### `create(name)`

Creates a new policy with the given name.

```ts
const policy = await addigy.policies.create('My New Policy')
```

**Returns:** `V2Policy`

---

## Smart Software

Access via `addigy.smartSoftware`.

### `list(options?)`

Returns all smart software items. Supports an optional `filter` in addition to standard pagination options.

```ts
const software = await addigy.smartSoftware.list({
  filter: { name_contains: 'Chrome', archived: false },
})
```

**Filter options (`SmartSoftwareFilter`):**

| Field          | Type       | Description                              |
|----------------|------------|------------------------------------------|
| `archived`     | `boolean`  | Filter by archived status                |
| `excluded_ids` | `string[]` | Exclude specific software IDs            |
| `identifier`   | `string`   | Filter by exact identifier               |
| `ids`          | `string[]` | Filter by specific software IDs          |
| `name_contains`| `string`   | Filter by name substring                 |

**Returns:** `CustomSoftware[]`

### `get(organizationId, id)`

Fetches a single smart software item by ID.

```ts
const sw = await addigy.smartSoftware.get('org-id', 'software-id')
```

### `create(organizationId, request)`

Creates a new smart software item.

```ts
const sw = await addigy.smartSoftware.create('org-id', {
  base_identifier: 'com.example.myapp',
  version: '1.0.0',
  installation_script: '#!/bin/bash\ninstaller -pkg "$1" -target /',
  condition: '#!/bin/bash\nexit 1',
  description: 'My App',
})
```

**Key fields (`CreateSmartSoftwareRequest`):**

| Field                | Type                        | Description                                    |
|----------------------|-----------------------------|------------------------------------------------|
| `base_identifier`    | `string` (required)         | Base identifier for the software family        |
| `version`            | `string` (required)         | Version string                                 |
| `installation_script`| `string`                    | Script run to install the software             |
| `condition`          | `string`                    | Script that determines if install is needed    |
| `remove_script`      | `string`                    | Script run to remove the software              |
| `downloads`          | `SmartSoftwareDownloadRequest[]` | Associated download file references       |
| `priority`           | `number`                    | Execution priority                             |
| `archived`           | `boolean`                   | Whether the item is archived                   |
| `status_on_skipped`  | `'finished'` \| `'failed'`  | Status to report when condition is skipped     |

### `delete(organizationId, id)`

Deletes a smart software item.

```ts
await addigy.smartSoftware.delete('org-id', 'software-id')
```

### `createNewVersion(organizationId, id, request)`

Creates a new version of an existing smart software item.

```ts
const newVersion = await addigy.smartSoftware.createNewVersion('org-id', 'software-id', {
  version: '2.0.0',
  installation_script: '#!/bin/bash\ninstaller -pkg "$1" -target /',
})
```

### `assignToPolicy(organizationId, policyId, assetId)`

Assigns a smart software item to a policy.

```ts
await addigy.smartSoftware.assignToPolicy('org-id', 'policy-id', 'software-id')
```

### `unassignFromPolicy(organizationId, policyId, assetId)`

Removes a smart software item from a policy.

```ts
await addigy.smartSoftware.unassignFromPolicy('org-id', 'policy-id', 'software-id')
```

---

## Users

Access via `addigy.users`.

### `list(organizationId, options?)` / `get(organizationId, options?)`

Returns all users in the organization. `get` is an alias for `list`.

```ts
const users = await addigy.users.list('org-id')
```

**Returns:** `OrganizationUser[]`

| Field          | Type       | Description                        |
|----------------|------------|------------------------------------|
| `email`        | `string`   | User's email address               |
| `name`         | `string`   | User's display name                |
| `addigy_role`  | `string`   | Role within the organization       |
| `orgid`        | `string`   | Organization ID                    |
| `phone`        | `string`   | Phone number                       |
| `policies`     | `string[]` | Policy IDs the user has access to  |

### `update(email, name, policies, role, phone?)`

Updates an existing user's name, role, policy access, and optionally phone number.

```ts
await addigy.users.update(
  'user@example.com',
  'Jane Doe',
  ['policy-id-1'],
  'user',
  '555-1234',
)
```

### `remove(email)`

Removes a user from the organization.

```ts
await addigy.users.remove('user@example.com')
```
