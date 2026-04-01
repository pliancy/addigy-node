import { AxiosInstance } from 'axios'
import { PaginationV2 } from './pagination-v2'
import {
    AssignCustomFactToPoliciesResponse,
    CreateCustomFactRequest,
    CreateCustomFactResponse,
    CustomFact,
    CustomFactsListOptions,
    CustomFactsListResponse,
    CustomFactUsage,
    UpdateCustomFactRequest,
    V2ListRequestBody,
} from './v2.types'

export class CustomFactsV2 {
    constructor(private readonly http: AxiosInstance) {}

    /**
     * Returns all custom facts.
     * Automatically paginates through all pages unless `paginate: false` is passed.
     * Supports an optional `filter` to narrow results by name or IDs.
     *
     * @param options - Pagination, sort, and filter options
     * @returns Array of `CustomFact` objects
     */
    async list(options?: CustomFactsListOptions): Promise<CustomFact[]> {
        const baseRequest: V2ListRequestBody = {}

        return PaginationV2.fetchItems<CustomFact>(async ({ page, per_page }) => {
            const requestBody = PaginationV2.buildRequestBody(baseRequest, {
                ...options,
                page,
                perPage: per_page,
            })
            if (options?.filter) {
                requestBody.query = options.filter
            }
            const response = await this.http.post('/oa/facts/custom/query', requestBody)
            return response.data as CustomFactsListResponse
        }, options)
    }

    /**
     * Fetches a single custom fact by ID.
     *
     * @param organizationId - The organization ID
     * @param id - The custom fact ID
     * @returns The `CustomFact` object
     */
    async get(organizationId: string, id: string): Promise<CustomFact> {
        const response = await this.http.get(
            `/o/${encodeURIComponent(organizationId)}/facts/custom/${encodeURIComponent(id)}`,
        )
        return response.data as CustomFact
    }

    /**
     * Returns where a custom fact is used across policies, alerts, reports, integrations, and user configs.
     *
     * @param organizationId - The organization ID
     * @param id - The custom fact ID
     * @returns `CustomFactUsage` describing where the fact is referenced
     */
    async getUsage(organizationId: string, id: string): Promise<CustomFactUsage> {
        const response = await this.http.get(
            `/o/${encodeURIComponent(organizationId)}/facts/custom/${encodeURIComponent(id)}/usage`,
        )
        return response.data as CustomFactUsage
    }

    /**
     * Creates a new custom fact.
     *
     * @param organizationId - The organization ID
     * @param request - The custom fact creation request body
     * @returns `CreateCustomFactResponse` containing both the `fact` and `instruction` objects
     */
    async create(
        organizationId: string,
        request: CreateCustomFactRequest,
    ): Promise<CreateCustomFactResponse> {
        const response = await this.http.post(
            `/o/${encodeURIComponent(organizationId)}/facts/custom`,
            request,
        )
        return response.data as CreateCustomFactResponse
    }

    /**
     * Updates an existing custom fact by ID.
     *
     * @param organizationId - The organization ID
     * @param request - The update request body, must include the fact `id`
     */
    async update(organizationId: string, request: UpdateCustomFactRequest): Promise<void> {
        await this.http.put(`/o/${encodeURIComponent(organizationId)}/facts/custom`, request)
    }

    /**
     * Deletes a custom fact.
     *
     * @param organizationId - The organization ID
     * @param id - The custom fact ID to delete
     */
    async delete(organizationId: string, id: string): Promise<void> {
        await this.http.delete(`/o/${encodeURIComponent(organizationId)}/facts/custom`, {
            params: { id },
        })
    }

    /**
     * Assigns a custom fact to one or more policies.
     *
     * @param organizationId - The organization ID
     * @param id - The custom fact ID
     * @param policies - Array of policy IDs to assign the fact to
     * @returns `AssignCustomFactToPoliciesResponse` with `succeeded` and `failed` arrays
     */
    async assignPolicies(
        organizationId: string,
        id: string,
        policies: string[],
    ): Promise<AssignCustomFactToPoliciesResponse> {
        const response = await this.http.post(
            `/o/${encodeURIComponent(organizationId)}/facts/custom/policy`,
            { id, policies },
        )
        return response.data as AssignCustomFactToPoliciesResponse
    }

    /**
     * Removes a custom fact from a single policy.
     *
     * @param organizationId - The organization ID
     * @param id - The custom fact ID
     * @param policyId - The policy ID to remove the fact from
     */
    async unassignPolicy(organizationId: string, id: string, policyId: string): Promise<void> {
        await this.http.delete(`/o/${encodeURIComponent(organizationId)}/facts/custom/policy`, {
            params: { id, policy_id: policyId },
        })
    }
}
