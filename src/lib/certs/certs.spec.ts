import axios from 'axios'
import { Certs } from './certs'

jest.mock('axios')

describe('Certs', () => {
    const authObjectMock = {
        authToken: 'testAuthToken',
        emailAddress: 'testEmail@addigy.com',
        orgId: 'testOrgId',
    }

    describe('getApnsCerts', () => {
        let certs: Certs

        beforeEach(() => {
            certs = new Certs()
            // @ts-ignore
            certs['http'] = axios
        })

        it('returns apns cert data on success', async () => {
            // Mock the axios response
            ;(axios.get as jest.Mock).mockResolvedValue({
                data: { items: ['certData1', 'certData2', 'certData3'] },
            })

            await expect(certs.getApnsCerts(authObjectMock)).resolves.toEqual([
                'certData1',
                'certData2',
                'certData3',
            ])
        })

        it('throws an error when the request fails', async () => {
            // Mock the axios error
            ;(axios.get as jest.Mock).mockImplementation(() => {
                throw new Error('Network Error') // replace with your expected error
            })

            await expect(certs.getApnsCerts(authObjectMock)).rejects.toThrow('Network Error')
        })
    })
})
