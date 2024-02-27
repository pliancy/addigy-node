import { AxiosInstance } from 'axios'
import { IAddigyConfig, IAddigyInternalAuthObject } from '../types'

export class Auth {
    constructor(
        private readonly http: AxiosInstance,
        private readonly config: IAddigyConfig,
    ) {}

    async getAuthObject(): Promise<IAddigyInternalAuthObject> {
        let postBody: any = {
            username: this.config.adminUsername,
            password: this.config.adminPassword,
        }

        try {
            if (!this.config.adminUsername || !this.config.adminPassword)
                throw new Error(
                    "The function you are using hits Addigy's internal API, but no username or password was provided in the constructor. Please fill out the adminUsername and adminPassword parameters.",
                )
            let res = await this.http.post('https://prod.addigy.com/signin/', postBody)

            let authObject = {
                orgId: res.data.orgid,
                authToken: res.data.authtoken,
                emailAddress: res.data.email,
            }

            return authObject
        } catch (err) {
            throw err
        }
    }

    async getImpersonationAuthObject(
        authObject: IAddigyInternalAuthObject,
        orgId: string,
    ): Promise<IAddigyInternalAuthObject> {
        let postBody: any = {
            parent_orgid: authObject.orgId,
            child_orgid: orgId,
            user_email: authObject.emailAddress,
        }

        try {
            let res = await this.http.post('https://app.addigy.com/api/impersonation', postBody, {
                headers: {
                    Cookie: `prod_auth_token=${authObject.authToken};`,
                    origin: 'https://app.addigy.com',
                },
            })

            const cookies: string[] = res.headers['set-cookie'] as string[]
            if (!(cookies && cookies.length)) throw new Error('No set-cookie found in response')

            const cookie = cookies.find(
                (e: string) => e.includes('prod_auth_token') && !e.includes('original_auth_token'),
            )

            if (!cookie) throw new Error('No auth cookie found')

            const tokenPart1 = cookie.split('auth_token=')[1]
            if (!tokenPart1) throw new Error('No token found in cookie')

            const authToken = tokenPart1.split(';')[0]
            if (!authToken) throw new Error('No token found in cookie')

            return {
                orgId: orgId,
                authToken,
                emailAddress: authObject.emailAddress,
            }
        } catch (err) {
            throw err
        }
    }
}
