import { IAddigyInternalAuthObject } from '../auth/auth.types'
import axios from 'axios'
import { Urls } from '../addigy.constants'
import { MdmConfigurationPayload } from './mdm.types'
import { getAxiosHttpAgents } from '../addigy.utils'

export class MdmConfigurations {
    private readonly http = axios.create({
        baseURL: `${Urls.app}/api/v2/mdm`,
        ...getAxiosHttpAgents(),
    })

    async getMdmConfigurations(
        authObject: IAddigyInternalAuthObject,
    ): Promise<MdmConfigurationPayload[]> {
        try {
            let res = await this.http.get('configurations/profiles', {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                },
            })
            return res.data?.payloads
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
