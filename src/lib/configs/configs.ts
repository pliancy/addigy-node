import { AxiosInstance } from 'axios'
import { IAddigyInternalAuthObject, MdmConfigurationPayload } from '../../types'

export class Configs {
    domain = ''

    reqHeaders = {}

    constructor(private readonly http: AxiosInstance) {}

    async getMdmConfigurations(
        authObject: IAddigyInternalAuthObject,
    ): Promise<MdmConfigurationPayload[]> {
        try {
            let res = await this.http.get(
                'https://app.addigy.com/api/v2/mdm/configurations/profiles',
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                },
            )
            return JSON.parse(res.data)?.payloads
        } catch (err) {
            throw err
        }
    }

    async getMdmConfigurationByName(authObject: IAddigyInternalAuthObject, name: string) {
        try {
            const mdmConfigurations = await this.getMdmConfigurations(authObject)
            return mdmConfigurations.find((e) => e.payload_display_name === name)
        } catch (err) {
            throw err
        }
    }
}
