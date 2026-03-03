import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent/http'
import { AddigyV2 } from './addigy-v2'
import { CertsV2 } from './certs-v2'
import { DevicesV2 } from './devices-v2'
import { PoliciesV2 } from './policies-v2'
import { UsersV2 } from './users-v2'

describe('AddigyV2', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('creates an AddigyV2 instance with API-key auth headers', () => {
        const addigyV2 = new AddigyV2({ apiKey: 'test-key' })
        const axiosInstance = addigyV2['http']

        expect(axiosInstance.defaults.baseURL).toEqual('https://api.addigy.com/api/v2')
        expect(axiosInstance.defaults.headers['x-api-key']).toBe('test-key')
        expect(axiosInstance.defaults.headers['client-id']).toBeUndefined()
        expect(axiosInstance.defaults.headers['client-secret']).toBeUndefined()
        expect(axiosInstance.defaults.httpAgent).toBeInstanceOf(HttpCookieAgent)
        expect(axiosInstance.defaults.httpsAgent).toBeInstanceOf(HttpsCookieAgent)
    })

    it('creates expected v2 dependencies', () => {
        const addigyV2 = new AddigyV2({ apiKey: 'test-key' })

        expect(addigyV2.certs).toBeInstanceOf(CertsV2)
        expect(addigyV2.devices).toBeInstanceOf(DevicesV2)
        expect(addigyV2.policies).toBeInstanceOf(PoliciesV2)
        expect(addigyV2.users).toBeInstanceOf(UsersV2)
    })
})
