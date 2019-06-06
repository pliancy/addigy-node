import got from 'got'
import fs from 'fs'
import formdata from 'form-data'

enum AlertStatus {
    Acknowledged = 'Acknowledged',
    Resolved = 'Resolved',
    Unattended = 'Unattended'
}

/**
 * The Config for the Addigy class
 * description of a thing
 * @export
 * @interface IAddigyConfig
 */
interface IAddigyConfig {
  /** the API credentials from Addigy */
  clientId: string
  clientSecret: string
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
