import got from 'got'
import fs from 'fs'
import formdata from 'form-data'
import { v4 as uuidv4 } from 'uuid'

enum AlertStatus {
    Acknowledged = 'Acknowledged',
    Resolved = 'Resolved',
    Unattended = 'Unattended'
}

enum UserRoles {
  Owner = 'power',
  Admin = 'admin',
  User = 'user'
}

/**
 * The Config for the Addigy class
 * This interface allows utilization of Addigy's internal API by using credentials of an actual user account
 * @export
 * @interface IAddigyConfig
 */
interface IAddigyConfig {
  /** the API credentials from Addigy */
  clientId: string
  clientSecret: string
  /** user account credentials with owner/power user role */
  adminUsername?: string
  adminPassword?: string
}

/*
 * Various combinations of the auth token, organization ID, and email address of the callee are
 * required for different calls to Addigy's internal API endpoints. To make things easier,
 * they are all packaged together into a single authentication object
 */
interface IAddigyInternalAuthObject {
  orgId: string
  authToken: string
  emailAddress: string
}

class Addigy {
  config: IAddigyConfig
  domain: string
  reqHeaders: any

  constructor (_config: IAddigyConfig) {
    this.config = _config
    this.reqHeaders = {
      'content-type': 'application/json',
      accept: 'application/json'
    }
    this.domain = 'https://prod.addigy.com/api'
  }

  //
  // Instructions
  //

  async getPolicyInstructions (policyId: string, provider: string = 'ansible-profile'): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/policies/instructions?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&provider=${provider}&policy_id=${policyId}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async createPolicyInstructions (policyId: string, instructionId: string): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/policies/instructions?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`,
        {
          headers: this.reqHeaders,
          method: 'POST',
          body: JSON.stringify({
            instruction_id: instructionId,
            policy_id: policyId
          })
        }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async deletePolicyInstructions (policyId: string, instructionId: string, provider: string = 'ansible-profile'): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/policies/instructions?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&policy_id=${policyId}&instruction_id=${instructionId}&provider=${provider}`,
        {
          headers: this.reqHeaders,
          method: 'DELETE'
        }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  //
  // Devices
  //

  async getOnlineDevices (): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/devices/online?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async getDevices (): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/devices?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async getPolicyDevices (policyId: string): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/policies/devices?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&policy_id=${policyId}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async updateDevicePolicy (policyId: string, agentId: string): Promise<object[]> {
    let postBody: any = {
      'policy_id': policyId,
      'agent_id': agentId
    }

    try {
      let res = await this._addigyRequest(
        `${this.domain}/policies/devices`,
        {
          headers: {
            'client-id': this.config.clientId,
            'client-secret': this.config.clientSecret
          },
          method: 'POST',
          form: true,
          body: postBody
        }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  //
  // Alerts
  //

  async getAlerts (status: AlertStatus, page: number = 1, pageLength: number = 10): Promise<object[]> {
    let statusUri = ''
    if (status) {
      statusUri = `&status=${status}`
    }

    try {
      let res = await this._addigyRequest(
        `${this.domain}/alerts?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&page=${page}&per_page=${pageLength}` + statusUri,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  //
  // Policies
  //

  async getPolicies (): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/policies?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async getPolicyDetails (policyId: string, provider: string = 'ansible-profile'): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/policies/details?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&provider=${provider}&policy_id=${policyId}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async createPolicy (name: string, parentId?: string, icon?: string, color?: string): Promise<object[]> {
    let postBody: any = {
      name: name
    }

    if (icon !== undefined) {
      postBody['icon'] = icon
    }

    if (color !== undefined) {
      postBody['color'] = color
    }

    if (parentId !== undefined) {
      postBody['parent_id'] = parentId
    }

    try {
      let res = await this._addigyRequest(
        `${this.domain}/policies?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`,
        {
          method: 'POST',
          form: true,
          body: postBody
        }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  //
  // Maintenance
  //

  async getMaintenance (page: number = 1, pageLenth: number = 10): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/maintenance?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&page=${page}&per_page=${pageLenth}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  //
  // Applications
  //

  async getInstalledApplications (): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/applications?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  //
  // Profiles
  //

  async getProfiles (instructionId?: string): Promise<object[]> {
    let instructionUri = ''
    if (instructionId !== undefined) {
      instructionUri = `&instruction_id=${instructionId}`
    }

    try {
      let res = await this._addigyRequest(
        `${this.domain}/profiles?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}` + instructionUri,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async createProfile (name: string, payloads: object[]): Promise<object[]> {
    let postBody: any = {
      'name': name,
      'payloads': payloads
    }

    try {
      let res = await this._addigyRequest(
        `${this.domain}/profiles`,
        {
          headers: {
            'client-id': this.config.clientId,
            'client-secret': this.config.clientSecret
          },
          method: 'POST',
          json: true,
          body: postBody
        }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async updateProfile (instructionId: string, payloads: object[]): Promise<object[]> {
    let postBody: any = {
      'instruction_id': instructionId,
      'payloads': payloads
    }

    try {
      let res = await this._addigyRequest(
        `${this.domain}/profiles`,
        {
          headers: {
            'client-id': this.config.clientId,
            'client-secret': this.config.clientSecret
          },
          method: 'PUT',
          json: true,
          body: postBody
        }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async deleteProfile (instructionId: string): Promise<object[]> {
    let postBody: any = {
      'instruction_id': instructionId
    }

    try {
      let res = await this._addigyRequest(
        `${this.domain}/profiles`,
        {
          headers: {
            'client-id': this.config.clientId,
            'client-secret': this.config.clientSecret
          },
          method: 'DELETE',
          json: true,
          body: postBody
        }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  //
  // Commands
  //

  async runCommand (agentIds: string[], command: string): Promise<object[]> {
    let postBody: any = {
      'agent_ids': agentIds,
      'command': command
    }

    try {
      let res = await this._addigyRequest(
        `${this.domain}/devices/commands`,
        {
          headers: {
            'client-id': this.config.clientId,
            'client-secret': this.config.clientSecret
          },
          method: 'POST',
          json: true,
          body: postBody
        }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  async getCommandOutput (actionId: string, agentId: string): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/devices/output?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&action_id=${actionId}&agentid=${agentId}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  //
  // Public Software
  //

  async getPublicSoftware (): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/catalog/public?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  //
  // Custom Software
  //

  async getCustomSoftware (): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/custom-software?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async getCustomSoftwareAllVersions (softwareId: string): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/custom-software?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}$identifier=${softwareId}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async getCustomSoftwareSpecificVersion (instructionId: string): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/custom-software?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&instructionid=${instructionId}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async getFileUploadUrl (): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `https://file-manager-prod.addigy.com/api/upload/url`,
        {
          headers: {
            'client-id': this.config.clientId,
            'client-secret': this.config.clientSecret
          }
        }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async uploadFile (uploadUrl: string, file: string): Promise<object[]> {
    let form = new formdata()
    form.append('file', fs.createReadStream(file))

    try {
      let res = await this._addigyRequest(
        `${uploadUrl}`,
        {
          headers: {
            'client-id': this.config.clientId,
            'client-secret': this.config.clientSecret
          },
          body: form
        }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  async createCustomSoftware (baseIdentifier: string, version: string, downloads: string[], installationScript: string, condition: string, removeScript: string): Promise<object[]> {
    let postBody: any = {
      'base_identifier': baseIdentifier,
      'version': version,
      'downloads': downloads,
      'installation_script': installationScript,
      'condition': condition,
      'remove_script': removeScript
    }

    try {
      let res = await this._addigyRequest(
        `${this.domain}/custom_software`,
        {
          headers: {
            'client-id': this.config.clientId,
            'client-secret': this.config.clientSecret
          },
          method: 'POST',
          json: true,
          body: postBody
        }
      )
      // Fun fact! This endpoint returns an empty string when successful. Yes, that is correct, an empty string...
      return res.body
    } catch (err) {
      throw err
    }
  }

  //
  // The following endpoints use Addigy's internal API. Use at your own risk.
  //

  async getUsers (authObject: IAddigyInternalAuthObject): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        'https://app-prod.addigy.com/api/account',
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`
          },
          method: 'GET'
        }
      )
      return JSON.parse(res.body).users
    } catch (err) {
      throw err
    }
  }

  async createUser (authObject: IAddigyInternalAuthObject, email: string, name: string, policies: string[] = [], role: UserRoles | string, phone?: string): Promise<object[]> {
    let postBody: any = {
      name: name,
      email: email,
      policies: policies,
      role: role
    }

    if (phone !== undefined) {
      postBody['phone'] = phone
    }

    try {
      let res = await this._addigyRequest(
        'https://app-prod.addigy.com/api/cloud/users/user',
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`
          },
          method: 'POST',
          json: true,
          body: postBody
        }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  async updateUser (authObject: IAddigyInternalAuthObject, email: string, name: string, policies: string[] = [], role: string, phone?: string): Promise<object[]> {
    let postBody: any = {
      id: '',
      uid: '', // this has to be blank on th PUT for some reason
      name: name,
      authanvil_tfa_username: '',
      email: email,
      phone: '',
      role: role,
      addigy_role: '', // this also has to be blank
      policies: policies
    }

    if (phone !== undefined) {
      postBody['phone'] = phone
    }

    try {
      // find userId that corresponds to the provided email
      let users: Array<any> = await this.getUsers(authObject)
      let user: any = users.find(element => element.email === email)
      if (!user) throw new Error(`No user with email ${email} exists.`)

      postBody['id'] = user.id // Addigy requires the user ID to be both in the post body and in the REST URI

      let res = await this._addigyRequest(
        `https://app-prod.addigy.com/api/cloud/users/user/${user.id}?user_email=${encodeURIComponent(user.email)}`,
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`
          },
          method: 'PUT',
          json: true,
          body: postBody
        }
      )
      return res.body // returns `ok` if successful...
    } catch (err) {
      throw err
    }
  }

  async deleteUser (authObject: IAddigyInternalAuthObject, email: string): Promise<object[]> {
    try {
      // find userId that corresponds to the provided email
      let users: Array<any> = await this.getUsers(authObject)
      let user: any = users.find(element => element.email === email)
      if (!user) throw new Error(`No user with email ${email} exists.`)

      let res = await this._addigyRequest(
        `https://app-prod.addigy.com/api/cloud/users/user/${user.id}?user_email=${encodeURIComponent(email)}`,
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`
          },
          method: 'DELETE'
        }
      )

      return JSON.parse(res.body) // this will return "ok" if successful.
    } catch (err) {
      throw err
    }
  }

  async getBillingData (authObject: IAddigyInternalAuthObject): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        'https://app-prod.addigy.com/api/billing/get_chargeover_billing_data',
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`,
            email: authObject.emailAddress,
            orgid: authObject.orgId
          },
          method: 'GET'
        }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async getApiIntegrations (authObject: IAddigyInternalAuthObject): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        'https://prod.addigy.com/accounts/api/keys/get/',
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`,
            email: authObject.emailAddress,
            orgid: authObject.orgId
          },
          method: 'GET'
        }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async createApiIntegration (authObject: IAddigyInternalAuthObject, name: string): Promise<object> {
    let postBody: any = {
      name
    }
    console.log(JSON.stringify(postBody))
    try {
      let res = await this._addigyRequest(
        'https://app-prod.addigy.com/api/integrations/keys',
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`
          },
          method: 'POST',
          json: true,
          body: postBody
        }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  async deleteApiIntegration (authObject: IAddigyInternalAuthObject, objectId: string): Promise<object> {
    try {
      let res = await this._addigyRequest(
        `https://app-prod.addigy.com/api/integrations/keys?id=${objectId}`,
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`
          },
          method: 'DELETE'
        }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  async getScreenconnectLinks (authObject: IAddigyInternalAuthObject, sessionId: string, agentId?: string): Promise<object[]> {
    // in most (all?) cases tested, the agentId and sessionId are identical, but they are independently passed in the API call
    agentId = agentId ? agentId : sessionId

    let postBody = {
      'sessionId': sessionId,
      'agentid': agentId
    }

    try {
      let res = await this._addigyRequest(
        'https://app-prod.addigy.com/api/devices/screenconnect/links',
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`,
            email: authObject.emailAddress,
            orgid: authObject.orgId
          },
          method: 'POST',
          json: true,
          body: postBody
        }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async createKernelExtensionPolicy (authObject: IAddigyInternalAuthObject, name: string, allowOverrides: boolean = false, teamIds?: string[], bundleIds?: object): Promise<object> {
    let payload: any = {}
    let payloadUUID = uuidv4()
    let groupUUID = uuidv4()
    if (teamIds) {
      payload['allowed_team_identifiers'] = teamIds
    }
    if (bundleIds) {
      payload['allowed_kernel_extensions'] = bundleIds
    }
    let postBody = {
      'payloads': [{
        addigy_payload_type: 'com.addigy.syspolicy.kernel-extension-policy.com.apple.syspolicy.kernel-extension-policy',
        payload_type: 'com.apple.syspolicy.kernel-extension-policy',
        payload_version: 1,
        payload_identifier: `com.addigy.syspolicy.kernel-extension-policy.com.apple.syspolicy.kernel-extension-policy.${groupUUID}`,
        payload_uuid: payloadUUID,
        payload_group_id: groupUUID,
        payload_enabled: true,
        payload_display_name: name,
        allow_user_overrides: allowOverrides,
        ...payload
      }]
    }

    try {
      let res = await this._addigyRequest(
        'https://app-prod.addigy.com/api/mdm/user/profiles/configurations',
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`
          },
          method: 'POST',
          json: true,
          body: postBody
        }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  async getFileVaultKeys (authObject: IAddigyInternalAuthObject): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        'https://prod.addigy.com/get_org_filevault_keys/',
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`
          },
          method: 'GET'
        }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async getApnsCerts (authObject: IAddigyInternalAuthObject, next?: string, previous?: string): Promise<object[]> {
    let url = 'https://app-prod.addigy.com/api/apn/user/apn/list'
    if (next) {
      url = `${url}?next=${next}`
    }
    if (previous) {
      url = `${url}?previous=${previous}`
    }

    try {
      let res = await this._addigyRequest(
        url,
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`,
            email: authObject.emailAddress,
            orgid: authObject.orgId
          },
          method: 'GET'
        }
      )
      return JSON.parse(res.body).mdm_app_list
    } catch (err) {
      throw err
    }
  }

  async getAuthObject (): Promise<IAddigyInternalAuthObject> {
    let postBody: any = {
      'username': this.config.adminUsername,
      'password': this.config.adminPassword
    }

    try {
      if (!this.config.adminUsername || !this.config.adminPassword) throw new Error('The function you are using hits Addigy\'s internal API, but no username or password was provided in the constructor. Please fill out the adminUsername and adminPassword parameters.')
      let res = await this._addigyRequest(
        'https://prod.addigy.com/signin/',
        {
          method: 'POST',
          json: true,
          body: postBody
        }
      )

      let authObject = {
        'orgId': res.body.orgid,
        'authToken': res.body.authtoken,
        'emailAddress': res.body.email
      }

      return authObject
    } catch (err) {
      throw err
    }
  }

  async getImpersonationAuthObject (authObject: IAddigyInternalAuthObject, orgId: string): Promise<IAddigyInternalAuthObject> {
    let postBody: any = {
      'orgid': orgId
    }

    try {
      let res = await this._addigyRequest(
        'https://prod.addigy.com/impersonate_org/',
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`
          },
          method: 'GET',
          json: true,
          body: postBody
        }
      )

      let impersonationAuthObject = {
        'orgId': orgId,
        'authToken': res.headers['set-cookie'].find((e: string) => e.includes('auth_token') && !e.includes('original_auth_token')).split('auth_token=')[1].split(';')[0],
        'emailAddress': authObject.emailAddress
      }

      return impersonationAuthObject
    } catch (err) {
      throw err
    }
  }

  private async _addigyRequest (url: string, options: any): Promise<any> {
    try {
      let res = await got(url, options)
      return res
    } catch (err) {
      throw err
    }
  }
}

export = Addigy
