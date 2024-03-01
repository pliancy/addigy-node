import { Addigy } from './addigy'
import { IAddigyConfig } from './types'
import { Alerts } from './alerts/alerts'
import { Auth } from './auth/auth'
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
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent/http'
import { MdmPolicies } from './mdm/mdm-policies'
import { MdmProfiles } from './mdm/mdm-profiles'

describe('Addigy', () => {
    let config: IAddigyConfig
    let addigy: Addigy

    beforeEach(() => {
        config = {
            clientId: 'clientId',
            clientSecret: 'clientSecret',
        }
        addigy = new Addigy(config)
    })

    it('creates an Addigy instance with the expected AxiosInstance', () => {
        const axiosInstance = addigy['http']
        expect(axiosInstance.defaults.baseURL).toEqual('https://prod.addigy.com/api')
        expect(axiosInstance.defaults.headers['client-id']).toBe(config.clientId)
        expect(axiosInstance.defaults.headers['client-secret']).toBe(config.clientSecret)
        expect(axiosInstance.defaults.httpAgent).toBeInstanceOf(HttpCookieAgent)
        expect(axiosInstance.defaults.httpsAgent).toBeInstanceOf(HttpsCookieAgent)
    })

    it('creates an Addigy instance with the expected dependencies', () => {
        expect(addigy.auth).toBeInstanceOf(Auth)
        expect(addigy.alerts).toBeInstanceOf(Alerts)
        expect(addigy.apps).toBeInstanceOf(Applications)
        expect(addigy.billing).toBeInstanceOf(Billing)
        expect(addigy.certs).toBeInstanceOf(Certs)
        expect(addigy.devices).toBeInstanceOf(Devices)
        expect(addigy.facts).toBeInstanceOf(Facts)
        expect(addigy.files).toBeInstanceOf(Files)
        expect(addigy.integrations).toBeInstanceOf(Integrations)
        expect(addigy.maintenance).toBeInstanceOf(Maintenance)
        expect(addigy.mdmConfigurations).toBeInstanceOf(MdmConfigurations)
        expect(addigy.mdmPolicies).toBeInstanceOf(MdmPolicies)
        expect(addigy.mdmProfiles).toBeInstanceOf(MdmProfiles)
        expect(addigy.policies).toBeInstanceOf(Policies)
        expect(addigy.profiles).toBeInstanceOf(Profiles)
        expect(addigy.screenconnect).toBeInstanceOf(ScreenConnect)
        expect(addigy.software).toBeInstanceOf(Software)
        expect(addigy.users).toBeInstanceOf(Users)
    })
})
