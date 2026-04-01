import { AxiosInstance } from 'axios'
import { PaginationV2 } from './pagination-v2'
import { DeviceAudit, DevicesListResponse, V2ListOptions, V2ListRequestBody } from './v2.types'

export class DevicesV2 {
    constructor(private readonly http: AxiosInstance) {}

    /**
     * Returns device audit records including all collected facts.
     * Automatically paginates through all pages unless `paginate: false` is passed.
     *
     * @param options - Pagination and sort options
     * @returns Array of `DeviceAudit` objects
     */
    async list(options?: V2ListOptions): Promise<DeviceAudit[]> {
        const baseRequest: V2ListRequestBody = {}

        return PaginationV2.fetchItems<DeviceAudit>(async ({ page, per_page }) => {
            const requestBody = PaginationV2.buildRequestBody(baseRequest, {
                ...options,
                page,
                perPage: per_page,
            })
            const response = await this.http.post('/devices', requestBody)
            return response.data as DevicesListResponse
        }, options)
    }
}
