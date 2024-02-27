import { AxiosInstance } from 'axios'
import { IAddigyInternalAuthObject } from '../../types'

export class Integrations {
    domain = ''

    reqHeaders = {}

    constructor(private readonly http: AxiosInstance) {}

    async getApiIntegrations(authObject: IAddigyInternalAuthObject): Promise<object[]> {
        try {
            let res = await this.http.get('https://prod.addigy.com/accounts/api/keys/get/', {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    origin: 'https://app-prod.addigy.com',
                    email: authObject.emailAddress,
                    orgid: authObject.orgId,
                },
            })
            return JSON.parse(res.data)
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
            let res = await this.http.post(
                'https://app-prod.addigy.com/api/integrations/keys',
                postBody,
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                },
            )
            return JSON.parse(res.data)
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
                `https://app-prod.addigy.com/api/integrations/keys?id=${objectId}`,
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                },
            )
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }
}
