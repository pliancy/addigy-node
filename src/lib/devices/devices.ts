import { AxiosInstance } from 'axios'
import { IAddigyConfig } from '../../types'

export class Devices {
    reqHeaders = {}

    domain = ''

    constructor(
        private readonly http: AxiosInstance,
        private readonly config: IAddigyConfig,
    ) {}

    async getOnlineDevices(): Promise<object[]> {
        try {
            let res = await this.http(`${this.domain}/devices/online`, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }

    async getDevices(): Promise<object[]> {
        try {
            let res = await this.http(`${this.domain}/devices`, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }

    async getPolicyDevices(policyId: string): Promise<object[]> {
        try {
            let res = await this.http(`${this.domain}/policies/devices?policy_id=${policyId}`, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }

    async updateDevicePolicy(policyId: string, agentId: string): Promise<object[]> {
        let postBody: any = {
            policy_id: policyId,
            agent_id: agentId,
        }

        try {
            let res = await this.http(`${this.domain}/policies/devices`, {
                headers: {
                    'client-id': this.config.clientId,
                    'client-secret': this.config.clientSecret,
                },
                method: 'POST',
                form: true,
                body: postBody,
            } as any)
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }
}
