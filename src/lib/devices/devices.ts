import { AxiosInstance } from 'axios'
import { IAddigyConfig } from '../types'
import { Device } from './devices.types'

export class Devices {
    constructor(
        private readonly http: AxiosInstance,
        private readonly config: IAddigyConfig,
    ) {}

    async getOnlineDevices(): Promise<Device[]> {
        try {
            let res = await this.http.get(`devices/online`)
            return res.data
        } catch (err) {
            throw err
        }
    }

    async getDevices(): Promise<Device[]> {
        try {
            let res = await this.http.get(`devices`)
            return res.data
        } catch (err) {
            throw err
        }
    }

    async getPolicyDevices(policyId: string): Promise<Device[]> {
        try {
            let res = await this.http.get(`policies/devices?policy_id=${policyId}`)
            return res.data
        } catch (err) {
            throw err
        }
    }

    async updateDevicePolicy(policyId: string, agentId: string): Promise<Device[]> {
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

    async runCommand(agentIds: string[], command: string): Promise<object[]> {
        let postBody: any = {
            agent_ids: agentIds,
            command: command,
        }

        try {
            let res = await this.http.post(`devices/commands`, postBody)
            return res.data
        } catch (err) {
            throw err
        }
    }

    async getCommandOutput(actionId: string, agentId: string): Promise<object[]> {
        try {
            let res = await this.http.get(`devices/output?action_id=${actionId}&agentid=${agentId}`)
            return res.data
        } catch (err) {
            throw err
        }
    }
}
