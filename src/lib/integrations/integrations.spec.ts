import axios from 'axios'
import { Integrations } from './integrations'

jest.mock('axios')

const authObjectMock = {
    authToken: 'testAuthToken',
    emailAddress: 'test@example.com',
    orgId: 'testOrgId',
}

describe('Integrations', () => {
    let integrations: Integrations

    beforeEach(() => {
        integrations = new Integrations()
        // @ts-ignore
        integrations['http'] = axios
    })

    describe('getApiIntegrations', () => {
        it('gets API integrations successfully', async () => {
            const integrationsMockData = [{ key: 'value' }]
            ;(axios.get as jest.Mock).mockResolvedValue({ data: integrationsMockData })

            const result = await integrations.getApiIntegrations(authObjectMock)
            expect(result).toEqual(integrationsMockData)
        })
    })

    describe('createApiIntegration', () => {
        it('creates an API integration successfully', async () => {
            const name = 'testIntegration'
            const creationResultMockData = { status: 'success' }
            ;(axios.post as jest.Mock).mockResolvedValue({ data: creationResultMockData })

            const result = await integrations.createApiIntegration(authObjectMock, name)
            expect(result).toEqual(creationResultMockData)
        })
    })

    describe('deleteApiIntegration', () => {
        it('deletes an API integration successfully', async () => {
            const objectId = 'testObjectId'
            const deletionResultMockData = { status: 'success' }
            ;(axios.delete as jest.Mock).mockResolvedValue({ data: deletionResultMockData })

            const result = await integrations.deleteApiIntegration(authObjectMock, objectId)
            expect(result).toEqual(deletionResultMockData)
        })
    })
})
