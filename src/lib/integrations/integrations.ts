import axios from 'axios'
import { IAddigyInternalAuthObject } from '../auth/auth.types'
import { Urls } from '../addigy.constants'
import { getAxiosHttpAgents } from '../addigy.utils'

export class Integrations {
    private readonly headers = { origin: Urls.appProd }

    private readonly http = axios.create({
        ...getAxiosHttpAgents(),
        headers: this.headers,
    })

    async getApiIntegrations(authObject: IAddigyInternalAuthObject): Promise<object[]> {
        try {
            let res = await this.http.get(`${Urls.api}/accounts/api/keys/get`, {
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

    async createApiIntegration(
        authObject: IAddigyInternalAuthObject,
        name: string,
    ): Promise<object> {
        let postBody: any = {
            name,
        }
        try {
            let res = await this.http.post(`${Urls.appProd}/api/integrations/keys`, postBody, {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                },
            })
            return res.data
        } catch (err) {
            throw err
        }
    }

    async deleteApiIntegration(
        authObject: IAddigyInternalAuthObject,
        objectId: string,
    ): Promise<object> {
        try {
            let res = await this.http.delete(
                `${Urls.appProd}/api/integrations/keys?id=${objectId}`,
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                    },
                },
            )
            return res.data
        } catch (err) {
            throw err
        }
    }
}
