import { Alerts } from './alerts'
import axios from 'axios'
import { AlertStatus } from './alert.types'

jest.mock('axios')

describe('Alerts', () => {
    let alerts: Alerts

    beforeEach(() => {
        alerts = new Alerts(axios)
    })

    describe('getAlerts', () => {
        it('should return alerts data on successful request', async () => {
            // Mock successful axios response
            ;(axios.get as jest.Mock).mockResolvedValue({
                data: [
                    // Sample data
                    {
                        id: 'alertId1',
                        status: AlertStatus.Acknowledged,
                        message: 'Alert message 1',
                    },
                    {
                        id: 'alertId2',
                        status: AlertStatus.Resolved,
                        message: 'Alert message 2',
                    },
                ],
            })

            const result = await alerts.getAlerts(AlertStatus.Acknowledged, 1, 10)

            expect(result).toEqual([
                {
                    id: 'alertId1',
                    status: AlertStatus.Acknowledged,
                    message: 'Alert message 1',
                },
                {
                    id: 'alertId2',
                    status: AlertStatus.Resolved,
                    message: 'Alert message 2',
                },
            ])
        })

        it('should throw error when request fails', async () => {
            ;(axios.get as jest.Mock).mockRejectedValue(new Error('Request failed.'))

            await expect(alerts.getAlerts(AlertStatus.Acknowledged, 1, 10)).rejects.toEqual(
                new Error('Request failed.'),
            )
        })
    })
})
