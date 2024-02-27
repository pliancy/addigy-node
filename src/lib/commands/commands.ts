import { AxiosInstance } from 'axios'

export class Commands {
    domain = ''

    reqHeaders = {}

    constructor(private readonly http: AxiosInstance) {}

    async runCommand(agentIds: string[], command: string): Promise<object[]> {
        let postBody: any = {
            agent_ids: agentIds,
            command: command,
        }

        try {
            let res = await this.http.post(`${this.domain}/devices/commands`, postBody, {
                headers: this.reqHeaders,
            })
            return res.data
        } catch (err) {
            throw err
        }
    }

    async getCommandOutput(actionId: string, agentId: string): Promise<object[]> {
        try {
            let res = await this.http.get(
                `${this.domain}/devices/output?action_id=${actionId}&agentid=${agentId}`,
                { headers: this.reqHeaders },
            )
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }
}
