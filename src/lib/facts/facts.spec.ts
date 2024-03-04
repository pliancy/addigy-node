import axios from 'axios'
import { Facts } from './facts'
import { IAddigyInternalAuthObject } from '../auth/auth.types'

jest.mock('axios')

const authObjectMock = {
    authToken: 'testAuthToken',
} as IAddigyInternalAuthObject
const factName = 'testFact'
const script = 'echo hello world'
const scriptType = 'bash'

describe('Facts', () => {
    let facts: Facts

    beforeEach(() => {
        facts = new Facts()
        // @ts-ignore
        facts['http'] = axios
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('createCustomFact', () => {
        it('successfully creates a custom fact', async () => {
            const customFactMockData = { factName, script, scriptType } // Replace with your expected data
            ;(axios.post as jest.Mock).mockResolvedValue({ data: customFactMockData })

            const result = await facts.createCustomFact(
                authObjectMock,
                factName,
                script,
                scriptType,
            )
            expect(result).toEqual(customFactMockData)
            expect(axios.post).toHaveBeenCalledWith(
                'custom',
                expect.objectContaining({
                    name: factName,
                    os_architectures: expect.objectContaining({
                        darwin_amd64: expect.objectContaining({
                            language: scriptType,
                            script,
                        }),
                    }),
                }),
                expect.objectContaining({
                    headers: { Cookie: `auth_token=${authObjectMock.authToken};` },
                }),
            )
        })
    })

    describe('getCustomFacts', () => {
        it('successfully gets custom facts', async () => {
            const customFactsMockData = [{ factName, script, scriptType }] // Replace with your expected data
            ;(axios.get as jest.Mock).mockResolvedValue({
                data: { custom_facts: customFactsMockData },
            })

            const result = await facts.getCustomFacts(authObjectMock)
            expect(result).toEqual(customFactsMockData)
            expect(axios.get).toHaveBeenCalledWith(
                'custom',
                expect.objectContaining({
                    headers: { Cookie: `auth_token=${authObjectMock.authToken};` },
                }),
            )
        })
    })

    describe('getCustomFactByName', () => {
        it('successfully gets a custom fact by its name', async () => {
            const customFactsMockData = [{ name: factName, script, scriptType }] // Replace with your expected data
            ;(axios.get as jest.Mock).mockResolvedValue({
                data: { custom_facts: customFactsMockData },
            })

            const result = await facts.getCustomFactByName(authObjectMock, factName)
            expect(result).toEqual(customFactsMockData.find((fact: any) => fact.name == factName))
            expect(axios.get).toHaveBeenCalledWith(
                'custom',
                expect.objectContaining({
                    headers: { Cookie: `auth_token=${authObjectMock.authToken};` },
                }),
            )
        })
    })
})
