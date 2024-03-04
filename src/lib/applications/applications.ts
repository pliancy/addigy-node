import { AxiosInstance } from 'axios'
import { InstalledApplicationsResponse } from './applications.types'

export class Applications {
    constructor(private readonly http: AxiosInstance) {}

    async getInstalledApplications(): Promise<InstalledApplicationsResponse> {
        try {
            let res = await this.http.get('applications')
            return res.data
        } catch (err) {
            throw err
        }
    }
}
