import axios from 'axios'
import { MdmPolicies } from './mdm-policies'
import { v4 as uuidv4 } from 'uuid'
import { IAddigyInternalAuthObject } from '../auth/auth.types'
import { CreateWebContentFilterPayload, PPPCInput, ServiceManagementPayloadRule } from './mdm.types'
import { FilevaultPayload } from '../files/files.types'

jest.mock('axios')
jest.mock('uuid')

describe('MdmPolicies', () => {
    let authObject: IAddigyInternalAuthObject
    let name: string
    let mdmPolicies: MdmPolicies
    const mockedAxios = axios as jest.Mocked<typeof axios>
    const mockedUuid = uuidv4 as jest.MockedFunction<typeof uuidv4>

    beforeEach(() => {
        authObject = { authToken: 'mocked-token' } as IAddigyInternalAuthObject
        name = 'mocked-name'
        mdmPolicies = new MdmPolicies()
        // @ts-ignore
        mdmPolicies['http'] = mockedAxios
        mockedUuid.mockReturnValue(new Uint8Array())
        mockedAxios.post.mockResolvedValue({ data: 'mocked-data' })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    const methods = [
        {
            method: 'createServiceManagementPolicy',
            args: [[] as ServiceManagementPayloadRule[]],
            name: 'service management policy',
        },
        {
            method: 'createWebContentFilterPolicy',
            args: [{} as CreateWebContentFilterPayload],
            name: 'web content filter policy',
        },
        {
            method: 'createFilevaultPolicy',
            args: [{} as FilevaultPayload],
            name: 'Filevault policy',
        },
        {
            method: 'createPPPCPolicy',
            args: [[] as PPPCInput[]],
            name: 'privacy preferences policy control',
        },
        {
            method: 'createMdmCertificate',
            args: [[] as PPPCInput[]],
            name: 'mdm certificate',
        },
    ]

    for (const test of methods) {
        describe(test.method, () => {
            it(`should successfully create a ${test.name}`, async () => {
                const response = await (mdmPolicies[test.method as keyof MdmPolicies] as Function)(
                    authObject,
                    name,
                    ...test.args,
                )
                expect(response).toBe('mocked-data')
                expect(mockedAxios.post).toHaveBeenCalledTimes(1)
            })

            it(`should throw an error when creating a ${test.name} fails`, async () => {
                const err = new Error('Network Error')
                mockedAxios.post.mockRejectedValue(err)
                await expect(
                    (mdmPolicies[test.method as keyof MdmPolicies] as Function)(
                        authObject,
                        name,
                        ...test.args,
                    ),
                ).rejects.toThrow('Network Error')
                expect(mockedAxios.post).toHaveBeenCalledTimes(1)
            })
        })
    }
})
