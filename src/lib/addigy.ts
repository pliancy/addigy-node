import { IAddigyConfig } from './types'
import { Alerts } from './alerts/alerts'
import { Applications } from './applications/applications'
import { Billing } from './billing/billing'
import { Certs } from './certs/certs'
import { MdmConfigurations } from './mdm/mdm-configurations'
import { Devices } from './devices/devices'
import { Facts } from './facts/facts'
import { Files } from './files/files'
import { Integrations } from './integrations/integrations'
import { Maintenance } from './maintenance/maintenance'
import { Policies } from './policies/policies'
import { Profiles } from './profiles/profiles'
import { ScreenConnect } from './screenconnect/screenconnect'
import { Software } from './software/software'
import { Users } from './users/users'
import axios, { AxiosInstance } from 'axios'
import { Auth } from './auth/auth'
import { Urls } from './addigy.constants'
import { MdmPolicies } from './mdm/mdm-policies'
import { getAxiosHttpAgents } from './addigy.utils'
import { MdmProfiles } from './mdm/mdm-profiles'

export class Addigy {
    auth: Auth

    alerts: Alerts

    apps: Applications

    billing: Billing

    certs: Certs

    devices: Devices

    facts: Facts

    files: Files

    integrations: Integrations

    maintenance: Maintenance

    mdmConfigurations: MdmConfigurations

    mdmPolicies: MdmPolicies

    mdmProfiles: MdmProfiles

    policies: Policies

    profiles: Profiles

    screenconnect: ScreenConnect

    software: Software

    users: Users

    private readonly http: AxiosInstance

    constructor(private readonly config: IAddigyConfig) {
        this.http = axios.create({
            baseURL: `${Urls.api}/api`,
            ...getAxiosHttpAgents(),
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
                'client-id': this.config.clientId,
                'client-secret': this.config.clientSecret,
            },
        })

        this.auth = new Auth(config)
        this.alerts = new Alerts(this.http)
        this.apps = new Applications(this.http)
        this.billing = new Billing()
        this.certs = new Certs()
        this.devices = new Devices(this.http, this.config)
        this.facts = new Facts()
        this.files = new Files(this.config)
        this.integrations = new Integrations()
        this.maintenance = new Maintenance(this.http)
        this.mdmConfigurations = new MdmConfigurations()
        this.mdmPolicies = new MdmPolicies()
        this.mdmProfiles = new MdmProfiles()
        this.policies = new Policies(this.http)
        this.profiles = new Profiles(this.http)
        this.screenconnect = new ScreenConnect()
        this.software = new Software(this.http)
        this.users = new Users()
    }
}
