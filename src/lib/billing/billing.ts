import axios from 'axios'
import { Urls } from '../addigy.constants'
import { IAddigyInternalAuthObject } from '../auth/auth.types'
import { getAxiosHttpAgents } from '../addigy.utils'

export class Billing {
    private readonly http = axios.create({
        baseURL: `${Urls.appProd}/api/billing`,
        ...getAxiosHttpAgents(),
        headers: {
            origin: Urls.appProd,
        },
    })

    async getBillingData(authObject: IAddigyInternalAuthObject): Promise<object[]> {
        try {
            let res = await this.http.get('get_chargeover_billing_data', {
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
