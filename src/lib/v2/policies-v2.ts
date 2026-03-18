import { AxiosInstance } from 'axios'
import { CreatePolicyRequest, PoliciesListResponse, V2Policy } from './v2.types'

export class PoliciesV2 {
    constructor(private readonly http: AxiosInstance) {}

    async list(policies?: string[]): Promise<V2Policy[]> {
        const requestBody = policies ? { policies } : {}
        const response = await this.http.post('/oa/policies/query', requestBody)
        const responseData = response.data as PoliciesListResponse | V2Policy[]

        if (Array.isArray(responseData)) {
            return responseData
        }

        return responseData.items ?? []
    }

    async create(name: string): Promise<V2Policy> {
        const requestBody: CreatePolicyRequest = { name }
        const response = await this.http.post('/policies', requestBody)
        return response.data as V2Policy
    }
}
