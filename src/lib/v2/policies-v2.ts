import { AxiosInstance } from 'axios'
import { PaginationV2 } from './pagination-v2'
import {
    CreatePolicyRequest,
    PoliciesListResponse,
    V2Policy,
    V2ListOptions,
    V2ListRequestBody,
} from './v2.types'

export class PoliciesV2 {
    constructor(private readonly http: AxiosInstance) {}

    async list(options?: V2ListOptions): Promise<V2Policy[]> {
        const baseRequest: V2ListRequestBody = {}

        return PaginationV2.fetchItems<V2Policy>(async ({ page, per_page }) => {
            const requestBody = PaginationV2.buildRequestBody(baseRequest, {
                ...options,
                page,
                perPage: per_page,
            })
            const response = await this.http.post('/oa/policies/query', requestBody)
            return response.data as PoliciesListResponse
        }, options)
    }

    async create(name: string): Promise<V2Policy> {
        const requestBody: CreatePolicyRequest = { name }
        const response = await this.http.post('/policies', requestBody)
        return response.data as V2Policy
    }
}
