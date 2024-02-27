import { IAddigyInternalAuthObject } from '../../types'
import { AxiosInstance } from 'axios'

export class ScreenConnect {
    domain = ''

    reqHeaders = {}

    constructor(private readonly http: AxiosInstance) {}

    async getScreenconnectLinks(
        authObject: IAddigyInternalAuthObject,
        sessionId: string,
        agentId?: string,
    ): Promise<object[]> {
        // in most (all?) cases tested, the agentId and sessionId are identical, but they are independently passed in the API call
        agentId = agentId ? agentId : sessionId

        let postBody = {
            sessionId: sessionId,
            agentid: agentId,
        }

        try {
            let res = await this.http.post(
                'https://app-prod.addigy.com/api/devices/screenconnect/links',
                postBody,
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                        email: authObject.emailAddress,
                        orgid: authObject.orgId,
                    },
                },
            )
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }
}
