import { AxiosInstance } from 'axios'
import { PaginationV2 } from './pagination-v2'
import {
    CreateSmartSoftwareRequest,
    CustomSoftware,
    SmartSoftwareListOptions,
    SmartSoftwareListResponse,
    UpdateSmartSoftwareRequest,
    V2ListRequestBody,
} from './v2.types'

export class SmartSoftwareV2 {
    constructor(private readonly http: AxiosInstance) {}

    /**
     * Returns all smart software items.
     * Automatically paginates through all pages unless `paginate: false` is passed.
     * Supports an optional `filter` to narrow results by name, identifier, IDs, or archived status.
     *
     * @param options - Pagination, sort, and filter options
     * @returns Array of `CustomSoftware` objects
     */
    async list(options?: SmartSoftwareListOptions): Promise<CustomSoftware[]> {
        const baseRequest: V2ListRequestBody = {
            sort_field: 'name',
            sort_direction: 'asc',
        }

        return PaginationV2.fetchItems<CustomSoftware>(async ({ page, per_page }) => {
            const requestBody = PaginationV2.buildRequestBody(baseRequest, {
                ...options,
                page,
                perPage: per_page,
            })
            if (options?.filter) {
                requestBody.query = options.filter
            }
            const response = await this.http.post('/oa/smart-software/query', requestBody)
            return response.data as SmartSoftwareListResponse
        }, options)
    }

    /**
     * Fetches a single smart software item by ID.
     *
     * @param organizationId - The organization ID
     * @param id - The smart software item ID
     * @returns The `CustomSoftware` object
     */
    async get(organizationId: string, id: string): Promise<CustomSoftware> {
        const response = await this.http.get(
            `/o/${encodeURIComponent(organizationId)}/smart-software/${encodeURIComponent(id)}`,
        )
        return response.data as CustomSoftware
    }

    /**
     * Creates a new smart software item.
     *
     * @param organizationId - The organization ID
     * @param request - The smart software creation request body
     * @returns The newly created `CustomSoftware` object
     */
    async create(organizationId: string, request: CreateSmartSoftwareRequest): Promise<CustomSoftware> {
        const response = await this.http.post(
            `/o/${encodeURIComponent(organizationId)}/smart-software`,
            request,
        )
        return response.data as CustomSoftware
    }

    /**
     * Deletes a smart software item.
     *
     * @param organizationId - The organization ID
     * @param id - The smart software item ID to delete
     */
    async delete(organizationId: string, id: string): Promise<void> {
        await this.http.delete(
            `/o/${encodeURIComponent(organizationId)}/smart-software/${encodeURIComponent(id)}`,
        )
    }

    /**
     * Creates a new version of an existing smart software item.
     *
     * @param organizationId - The organization ID
     * @param id - The ID of the existing smart software item
     * @param request - The update request body containing the new version details
     * @returns The newly created `CustomSoftware` version object
     */
    async createNewVersion(
        organizationId: string,
        id: string,
        request: UpdateSmartSoftwareRequest,
    ): Promise<CustomSoftware> {
        const response = await this.http.post(
            `/o/${encodeURIComponent(organizationId)}/smart-software/${encodeURIComponent(id)}/new-version`,
            request,
        )
        return response.data as CustomSoftware
    }

    /**
     * Assigns a smart software item to a policy.
     *
     * @param organizationId - The organization ID
     * @param policyId - The policy ID to assign the software to
     * @param assetId - The smart software item ID
     */
    async assignToPolicy(organizationId: string, policyId: string, assetId: string): Promise<void> {
        await this.http.post(
            `/o/${encodeURIComponent(organizationId)}/policies/${encodeURIComponent(policyId)}/smart-software/${encodeURIComponent(assetId)}`,
        )
    }

    /**
     * Removes a smart software item from a policy.
     *
     * @param organizationId - The organization ID
     * @param policyId - The policy ID to remove the software from
     * @param assetId - The smart software item ID
     */
    async unassignFromPolicy(organizationId: string, policyId: string, assetId: string): Promise<void> {
        await this.http.delete(
            `/o/${encodeURIComponent(organizationId)}/policies/${encodeURIComponent(policyId)}/smart-software/${encodeURIComponent(assetId)}`,
        )
    }
}
