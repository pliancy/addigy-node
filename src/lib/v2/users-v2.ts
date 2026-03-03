import { AxiosInstance } from 'axios'
import { PaginationV2 } from './pagination-v2'
import { V2ListOptions, V2ListRequestBody } from './v2.types'

export class UsersV2 {
    constructor(private readonly http: AxiosInstance) {}

    async get(organizationId: string, options?: V2ListOptions): Promise<object[]> {
        return this.list(organizationId, options)
    }

    async list(organizationId: string, options?: V2ListOptions): Promise<object[]> {
        const baseRequest: V2ListRequestBody = {}

        return PaginationV2.fetchItems<object>(async ({ page, per_page }) => {
            const requestBody = PaginationV2.buildRequestBody(baseRequest, {
                ...options,
                page,
                perPage: per_page,
            })
            const response = await this.http.post(
                `/o/${encodeURIComponent(organizationId)}/users/query`,
                requestBody,
            )
            return response.data
        }, options)
    }

    async update(
        email: string,
        name: string,
        policies: string[],
        role: string,
        phone?: string,
    ): Promise<object> {
        const requestBody: Record<string, unknown> = {
            email,
            name,
            role,
            policies,
        }

        if (typeof phone === 'string') {
            requestBody.phone = phone
        }

        const response = await this.http.put('/users', requestBody)
        return response.data
    }

    async remove(email: string): Promise<object> {
        const response = await this.http.delete('/users', {
            params: {
                email,
            },
        })
        return response.data
    }
}
