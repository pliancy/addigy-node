import axios from 'axios'
import { Maintenance } from './maintenance'

jest.mock('axios')

describe('Maintenance', () => {
    let maintenance: Maintenance

    beforeEach(() => {
        maintenance = new Maintenance(axios)
    })

    describe('getMaintenance', () => {
        it('gets maintenance data successfully', async () => {
            const maintenanceMockData = [
                { id: 1, name: 'Maintenance 1' },
                { id: 2, name: 'Maintenance 2' },
            ]
            ;(axios.get as jest.Mock).mockResolvedValue({ data: maintenanceMockData })

            const result = await maintenance.getMaintenance(1, 10)
            expect(result).toEqual(maintenanceMockData)
        })
    })
})
