import { AxiosInstance } from 'axios'

export class Maintenance {
    domain = ''

    reqHeaders = {}

    constructor(private readonly http: AxiosInstance) {}

    async getMaintenance(page: number = 1, pageLenth: number = 10): Promise<object[]> {
        try {
            let res = await this.http.get(
                `${this.domain}/maintenance?page=${page}&per_page=${pageLenth}`,
                { headers: this.reqHeaders },
            )
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }
}
