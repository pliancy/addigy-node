import { AlertStatus } from './alert.types'
import { AxiosInstance } from 'axios'

export class Alerts {
    constructor(private readonly http: AxiosInstance) {}

    async getAlerts(
        status: AlertStatus,
        page: number = 1,
        pageLength: number = 10,
    ): Promise<object[]> {
        let statusUri = ''
        if (status) {
            statusUri = `&status=${status}`
        }

        try {
            let res = await this.http.get(`alerts?page=${page}&per_page=${pageLength}` + statusUri)
            return res.data
        } catch (err) {
            throw err
        }
    }
}
