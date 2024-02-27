import { AxiosInstance } from 'axios'

export class Applications {
    domain = ''

    reqHeaders = {}

    constructor(private readonly http: AxiosInstance) {}
    async getInstalledApplications(): Promise<object[]> {
        try {
            let res = await this.http.get(`${this.domain}/applications`, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }
}
