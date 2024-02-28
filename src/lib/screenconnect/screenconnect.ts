import { IAddigyInternalAuthObject } from '../auth/auth.types'
import axios from 'axios'
import { Urls } from '../addigy.constants'
import { getAxiosHttpAgents } from '../addigy.utils'

export class ScreenConnect {
    private readonly http = axios.create({
        baseURL: `${Urls.appProd}/api/devices/screenconnect`,
        ...getAxiosHttpAgents(),
        headers: { origin: Urls.appProd },
    })

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
            let res = await this.http.post('links', postBody, {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    email: authObject.emailAddress,
                    orgid: authObject.orgId,
                },
            })
            return res.data
        } catch (err) {
            throw err
        }
    }
}
