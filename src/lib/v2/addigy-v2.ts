import axios, { AxiosInstance } from 'axios'
import { getAxiosHttpAgents } from '../addigy.utils'
import { CertsV2 } from './certs-v2'
import { CustomFactsV2 } from './custom-facts-v2'
import { DevicesV2 } from './devices-v2'
import { MdmConfigurationsV2 } from './mdm-configurations-v2'
import { PoliciesV2 } from './policies-v2'
import { SmartSoftwareV2 } from './smart-software-v2'
import { IAddigyV2Config } from './v2.types'
import { UsersV2 } from './users-v2'

export class AddigyV2 {
    certs: CertsV2

    customFacts: CustomFactsV2

    devices: DevicesV2

    mdmConfigurations: MdmConfigurationsV2

    policies: PoliciesV2

    smartSoftware: SmartSoftwareV2

    users: UsersV2

    private readonly http: AxiosInstance

    constructor(private readonly config: IAddigyV2Config) {
        this.http = axios.create({
            baseURL: 'https://api.addigy.com/api/v2',
            ...getAxiosHttpAgents(),
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
                'x-api-key': this.config.apiKey,
            },
        })

        this.certs = new CertsV2(this.http)
        this.customFacts = new CustomFactsV2(this.http)
        this.devices = new DevicesV2(this.http)
        this.mdmConfigurations = new MdmConfigurationsV2(this.http)
        this.policies = new PoliciesV2(this.http)
        this.smartSoftware = new SmartSoftwareV2(this.http)
        this.users = new UsersV2(this.http)
    }
}
