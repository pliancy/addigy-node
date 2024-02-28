import { ScreenConnect } from './screenconnect'
import axios from 'axios'

jest.mock('axios')

const mockAxios = axios as jest.Mocked<typeof axios>

describe('ScreenConnect', () => {
    let screenConnect: ScreenConnect

    const authObject = {
        authToken: 'authToken',
        emailAddress: 'emailAddress',
        orgId: 'orgId',
    }
    const sessionId = 'sessionId'
    const agentId = 'agentId'

    beforeEach(() => {
        screenConnect = new ScreenConnect()
        // @ts-ignore
        screenConnect['http'] = mockAxios
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should get screenconnect links', async () => {
        const mockData = [{ id: 'link1' }, { id: 'link2' }]
        mockAxios.post.mockResolvedValue({ data: mockData })

        const result = await screenConnect.getScreenconnectLinks(authObject, sessionId, agentId)

        expect(result).toEqual(mockData)
        expect(mockAxios.post).toHaveBeenLastCalledWith(
            'links',
            { sessionId, agentid: agentId },
            {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    email: authObject.emailAddress,
                    orgid: authObject.orgId,
                },
            },
        )
    })

    it('should use sessionId as agentId if agentId is not provided', async () => {
        const mockData = [{ id: 'link1' }, { id: 'link2' }]
        mockAxios.post.mockResolvedValue({ data: mockData })

        const result = await screenConnect.getScreenconnectLinks(authObject, sessionId)

        expect(result).toEqual(mockData)
        expect(mockAxios.post).toHaveBeenLastCalledWith(
            'links',
            { sessionId, agentid: sessionId },
            {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    email: authObject.emailAddress,
                    orgid: authObject.orgId,
                },
            },
        )
    })

    it('should handle errors when getting screenconnect links', async () => {
        mockAxios.post.mockRejectedValue(new Error('error'))

        await expect(
            screenConnect.getScreenconnectLinks(authObject, sessionId, agentId),
        ).rejects.toThrow('error')
    })
})
