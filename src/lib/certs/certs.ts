import { AxiosInstance } from 'axios'
import { IAddigyInternalAuthObject } from '../../types'

export class Certs {
    domain = ''

    reqHeaders = {}

    constructor(private readonly http: AxiosInstance) {}

    async getApnsCerts(
        authObject: IAddigyInternalAuthObject,
        next?: string,
        previous?: string,
    ): Promise<object[]> {
        let url = 'https://app-prod.addigy.com/api/apn/user/apn/list'
        if (next) {
            url = `${url}?next=${next}`
        }
        if (previous) {
            url = `${url}?previous=${previous}`
        }

        try {
            let res = await this.http.get(url, {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    origin: 'https://app-prod.addigy.com',
                    email: authObject.emailAddress,
                    orgid: authObject.orgId,
                },
            })
            return JSON.parse(res.data).items
        } catch (err) {
            throw err
        }
    }
}
