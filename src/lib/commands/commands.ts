import { AxiosInstance } from 'axios'

export class Commands {
    constructor(private readonly http: AxiosInstance) {}

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
