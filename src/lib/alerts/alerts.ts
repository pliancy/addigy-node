import { AxiosInstance } from 'axios'
import { AlertStatus } from './alert.types'

export class Alerts {
    reqHeaders = {}

    domain = ''

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
            let res = await this.http(
                `${this.domain}/alerts?page=${page}&per_page=${pageLength}` + statusUri,
                { headers: this.reqHeaders },
            )
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }
}
