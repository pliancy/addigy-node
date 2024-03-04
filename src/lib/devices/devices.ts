import { AxiosInstance } from 'axios'
import { IAddigyConfig } from '../types'

export class Devices {
    constructor(
        private readonly http: AxiosInstance,
        private readonly config: IAddigyConfig,
    ) {}

    async getOnlineDevices(): Promise<object[]> {
        try {
            let res = await this.http.get(`devices/online`)
            return res.data
        } catch (err) {
            throw err
        }
    }

    async getDevices(): Promise<object[]> {
        try {
            let res = await this.http.get(`devices`)
            return res.data
        } catch (err) {
            throw err
        }
    }

    async getPolicyDevices(policyId: string): Promise<object[]> {
        try {
            let res = await this.http.get(`policies/devices?policy_id=${policyId}`)
            return res.data
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
            let res = await this.http.post(`policies/devices`, postBody, {
                headers: {
                    'client-id': this.config.clientId,
                    'client-secret': this.config.clientSecret,
                },
            } as any)
            return res.data
        } catch (err) {
            throw err
        }
    }
}
