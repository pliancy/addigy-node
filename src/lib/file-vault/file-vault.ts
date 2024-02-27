import { AxiosInstance } from 'axios'
import { IAddigyInternalAuthObject } from '../../types'

export class FileVault {
    domain = ''

    reqHeaders = {}

    constructor(private readonly http: AxiosInstance) {}

    async getFileVaultKeys(authObject: IAddigyInternalAuthObject): Promise<object[]> {
        try {
            let res = await this.http.get('https://prod.addigy.com/get_org_filevault_keys/', {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    origin: 'https://app-prod.addigy.com',
                },
            })
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }
}
