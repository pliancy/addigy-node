import { MdmProfiles } from './mdm-profiles'
import { IAddigyInternalAuthObject } from '../auth/auth.types'
import { SupportedOsVersions } from '../types'
import axios from 'axios'
import { v4 } from 'uuid'
import plist from '@expo/plist'

jest.mock('axios')
jest.mock('uuid')
jest.mock('@expo/plist')

describe('MdmProfiles', () => {
    let authObject: IAddigyInternalAuthObject
    let name: string
    let customProfileText: string
    let supportedOsVersions: SupportedOsVersions
    let mdmProfiles: MdmProfiles
    let payloadScope: 'System' | 'User'
    let is_profile_signed: boolean
    let mdmProfile: any

    const mockedAxios = axios as jest.Mocked<typeof axios>
    const mockedUuid = v4 as jest.MockedFunction<typeof v4>
    const mockedPlist = plist.parse as jest.MockedFunction<typeof plist.parse>

    beforeEach(() => {
        authObject = { authToken: 'mocked-token' } as IAddigyInternalAuthObject
        name = 'mocked-name'
        customProfileText = 'mocked-custom-profile-text'
        supportedOsVersions = [] as SupportedOsVersions
        payloadScope = 'System'
        is_profile_signed = false
        mdmProfile = {} // specific mdmProfile object here
        mdmProfiles = new MdmProfiles()
        // @ts-ignore
        mdmProfiles['http'] = mockedAxios
        mockedUuid.mockReturnValue(new Uint8Array())
        mockedAxios.post.mockResolvedValue({ data: 'mocked-data' })
        mockedPlist.mockReturnValue({})
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('createCustomProfile', () => {
        it('createCustomProfile should create a custom profile', async () => {
            const response = await mdmProfiles.createCustomProfile(
                authObject,
                name,
                customProfileText,
                supportedOsVersions,
                payloadScope,
                is_profile_signed,
            )
            expect(response).toBe('mocked-data')
            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
        })

        it('createCustomProfile should throw an error when creation fails', async () => {
            const err = new Error('Network Error')
            mockedAxios.post.mockRejectedValue(err)
            await expect(
                mdmProfiles.createCustomProfile(
                    authObject,
                    name,
                    customProfileText,
                    supportedOsVersions,
                    payloadScope,
                    is_profile_signed,
                ),
            ).rejects.toThrow('Network Error')
            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
        })

        it('createCustomProfile should convert customProfileText keys to snake case', async () => {
            const customProfileTextCamelCase = `<plist version="1.0"><dict><key>camelCaseKey</key><string>value</string></dict></plist>`
            mockedPlist.mockReturnValue({ camelCaseKey: 'value' })
            await mdmProfiles.createCustomProfile(
                authObject,
                name,
                customProfileTextCamelCase,
                supportedOsVersions,
                payloadScope,
                is_profile_signed,
            )

            const args = mockedAxios.post.mock.calls[0] as any[]
            const payload = args[1].payloads[0]
            expect(payload.profile_json_data).toEqual({ camel_case_key: 'value' })
        })
    })

    describe('createMdmProfile', () => {
        it('createMdmProfile should create a MDM profile', async () => {
            const response = await mdmProfiles.createMdmProfile(authObject, mdmProfile)
            expect(response).toBe('mocked-data')
            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
        })

        it('createMdmProfile should throw an error when creation fails', async () => {
            const err = new Error('Network Error')
            mockedAxios.post.mockRejectedValue(err)
            await expect(mdmProfiles.createMdmProfile(authObject, mdmProfile)).rejects.toThrow(
                'Network Error',
            )
            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
        })
    })
})
