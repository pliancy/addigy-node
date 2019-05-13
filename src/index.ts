import got from 'got'
import qs from 'query-string'

/**
 * The Config for the Addigy class
 *
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

  async getPolicyInstructions (policy_id: string, provider: string = 'ansible-profile'): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/policies/instructions?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&provider=${provider}&policy_id=${policy_id}`,
        { headers: this.reqHeaders }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  // TODO: createPolicyInstruction()
  // TODO: deletePolicyInstruction()


  //
  // Devices
  //

  async getOnlineDevices (): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/devices/online?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`,
        { headers: this.reqHeaders }
      )
      return res.body
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
      return res.body
    } catch (err) {
      throw err
    }
  }

  async getPolicyDevices (policy_id: string): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/policies/devices?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&policy_id=${policy_id}`,
        { headers: this.reqHeaders }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  //TODO: createPolicyDevice()



  //
  // Alerts
  //

  // TODO: Create ENUM for status
  async getAlerts (status: string, page: number = 1, per_page: number = 10): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/alerts?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&status=${status}&page=${page}&per_page=${per_page}`,
        { headers: this.reqHeaders }
      )
      return res.body
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
      return res.body
    } catch (err) {
      throw err
    }
  }

  async getPolicyDetails (policy_id: string, provider: string = 'ansible-profile'): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/policies/details?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&provider=${provider}&policy_id=${policy_id}`,
        { headers: this.reqHeaders }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  // TODO: createPolicy()



  //
  // Maintenance
  //

  async getMaintenance (page: number = 1, per_page: number = 10): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/maintenance?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&page=${page}&per_page=${per_page}`,
        { headers: this.reqHeaders }
      )
      return res.body
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
      return res.body
    } catch (err) {
      throw err
    }
  }




  //
  // Profiles
  //

  async getProfiles (instruction_id?: string): Promise<object[]> {
    let instruction_uri = ''
    if(instruction_id !== undefined) {
      instruction_id = `&instruction_id=${instruction_id}`
    }

    try {
      let res = await this._addigyRequest(
        `${this.domain}/profiles?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}` + instruction_uri,
        { headers: this.reqHeaders }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  // TODO: createProfile()
  // TODO: updateProfile()
  // TODO: deleteProfile()



  //
  // Commands
  //

  // TODO: runCommand()

  async getCommandOutput (action_id: string, agent_id: string): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/devices/output?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&action_id=${action_id}&agentid=${agent_id}`,
        { headers: this.reqHeaders }
      )
      return res.body
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
      return res.body
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
      return res.body
    } catch (err) {
      throw err
    }
  }

  async getCustomSoftwareAllVersions (software_id: string): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/custom-software?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}$identifier=${software_id}`,
        { headers: this.reqHeaders }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  async getCustomSoftwareSpecificVersion (instruction_id: string): Promise<object[]> {
    try {
      let res = await this._addigyRequest(
        `${this.domain}/custom-software?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&instructionid=${instruction_id}`,
        { headers: this.reqHeaders }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  async getFileUploadUrl (instruction_id: string): Promise<object[]> {
    try {
      // Why is this base URL different, you might ask? Great question... ask Addigy.
      let res = await this._addigyRequest(
        `https://file-manager-prod.addigy.com/api/upload/url?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}`,
        { headers: this.reqHeaders }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  // TODO: uploadFile()
  // TODO: createCustomSoftware()

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
