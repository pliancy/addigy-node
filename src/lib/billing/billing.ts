import { AxiosInstance } from 'axios'
import { IAddigyInternalAuthObject } from '../../types'

export class Billing {
    domain = ''

    reqHeaders = {}

    constructor(private readonly http: AxiosInstance) {}

    async getBillingData(authObject: IAddigyInternalAuthObject): Promise<object[]> {
        try {
            let res = await this.http.get(
                'https://app-prod.addigy.com/api/billing/get_chargeover_billing_data',
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
