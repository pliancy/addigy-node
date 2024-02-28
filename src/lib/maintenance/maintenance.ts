import { AxiosInstance } from 'axios'

export class Maintenance {
    constructor(private readonly http: AxiosInstance) {}

    async getMaintenance(page = 1, pageLength = 10): Promise<object[]> {
        try {
            let res = await this.http.get(`maintenance?page=${page}&per_page=${pageLength}`)
            return res.data
        } catch (err) {
            throw err
        }
    }
}
