import axios from 'axios'
import { Applications } from './applications'

jest.mock('axios')

describe('Applications', () => {
    describe('getInstalledApplications', () => {
        let applications: Applications

        beforeEach(() => {
            applications = new Applications(axios)
        })

        it('returns the list of installed applications on success', async () => {
            // Mock the axios response
            ;(axios.get as jest.Mock).mockResolvedValue({
                data: ['app1', 'app2', 'app3'],
            })

            await expect(applications.getInstalledApplications()).resolves.toEqual([
                'app1',
                'app2',
                'app3',
            ])
        })

        it('throws an error when the request fails', async () => {
            // Mock the axios error
            ;(axios.get as jest.Mock).mockImplementation(() => {
                throw new Error('Network Error')
            })

            await expect(applications.getInstalledApplications()).rejects.toThrow('Network Error')
        })
    })
})
