import { AxiosInstance } from 'axios'
import { CreatePolicyRequest, PoliciesListResponse, V2Policy } from './v2.types'

export class PoliciesV2 {
    constructor(private readonly http: AxiosInstance) {}

    /**
     * Returns all policies, or a filtered subset by policy ID.
     *
     * @param policies - Optional array of policy IDs to filter results
     * @returns Array of `V2Policy` objects
     */
    async list(policies?: string[]): Promise<V2Policy[]> {
        const requestBody = policies ? { policies } : {}
        const response = await this.http.post('/oa/policies/query', requestBody)
        const responseData = response.data as PoliciesListResponse | V2Policy[]

        if (Array.isArray(responseData)) {
            return responseData
        }

        return responseData.items ?? []
    }

    /**
     * Creates a new policy with the given name.
     *
     * @param name - The display name for the new policy
     * @returns The newly created `V2Policy` object
     */
    async create(name: string): Promise<V2Policy> {
        const requestBody: CreatePolicyRequest = { name }
        const response = await this.http.post('/policies', requestBody)
        return response.data as V2Policy
    }
}
