import axios from 'axios'
import { Urls } from '../addigy.constants'
import { IAddigyInternalAuthObject } from '../auth/auth.types'
import { getAxiosHttpAgents } from '../addigy.utils'

export class Certs {
    private readonly http = axios.create({
        baseURL: `${Urls.appProd}/api`,
        ...getAxiosHttpAgents(),
        headers: {
            origin: Urls.appProd,
        },
    })

    async getApnsCerts(
        authObject: IAddigyInternalAuthObject,
        next?: string,
        previous?: string,
    ): Promise<object[]> {
        let url = 'apn/user/apn/list'
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
                    email: authObject.emailAddress,
                    orgid: authObject.orgId,
                },
            })
            return res.data.items
        } catch (err) {
            throw err
        }
    }
}
