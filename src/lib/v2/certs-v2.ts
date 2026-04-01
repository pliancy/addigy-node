import { AxiosInstance } from 'axios'
import { PaginationV2 } from './pagination-v2'
import {
    CertsListResponse,
    InstalledCertificate,
    V2ListOptions,
    V2ListRequestBody,
} from './v2.types'

export class CertsV2 {
    constructor(private readonly http: AxiosInstance) {}

    /**
     * Returns all installed MDM certificates across devices.
     * Automatically paginates through all pages unless `paginate: false` is passed.
     *
     * @param options - Pagination and sort options
     * @returns Array of `InstalledCertificate` objects
     */
    async list(options?: V2ListOptions): Promise<InstalledCertificate[]> {
        const baseRequest: V2ListRequestBody = {}

        return PaginationV2.fetchItems<InstalledCertificate>(async ({ page, per_page }) => {
            const requestBody = PaginationV2.buildRequestBody(baseRequest, {
                ...options,
                page,
                perPage: per_page,
            })
            const response = await this.http.post('/mdm/certificates/query', requestBody)
            return response.data as CertsListResponse
        }, options)
    }
}
