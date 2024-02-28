import axios from 'axios'
import { Billing } from './billing'

jest.mock('axios')

const authObjectMock = {
    authToken: 'testAuthToken',
    emailAddress: 'testEmail@addigy.com',
    orgId: 'testOrgId',
}

describe('Billing', () => {
    describe('getBillingData', () => {
        let billing: Billing

        beforeEach(() => {
            billing = new Billing()
            // @ts-ignore
            billing['http'] = axios
        })

        it('returns billing data on success', async () => {
            // Mock the axios response
            ;(axios.get as jest.Mock).mockResolvedValue({
                data: ['billingData1', 'billingData2', 'billingData3'],
            })

            await expect(billing.getBillingData(authObjectMock)).resolves.toEqual([
                'billingData1',
                'billingData2',
                'billingData3',
            ])
        })

        it('throws an error when the request fails', async () => {
            // Mock the axios error
            ;(axios.get as jest.Mock).mockImplementation(() => {
                throw new Error('Network Error')
            })

            await expect(billing.getBillingData(authObjectMock)).rejects.toThrow('Network Error')
        })
    })
})
