import { AxiosInstance } from 'axios'

export class Applications {
    constructor(private readonly http: AxiosInstance) {}

    async getInstalledApplications(): Promise<object[]> {
        try {
            let res = await this.http.get('applications')
            return res.data
        } catch (err) {
            throw err
        }
    }
}
