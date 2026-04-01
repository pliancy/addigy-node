import { AxiosInstance } from 'axios'
import { PaginationV2 } from './pagination-v2'
import {
    OrganizationUser,
    UserRemoveResponse,
    UserUpdateRequest,
    UserUpdateResponse,
    UsersListResponse,
    V2ListOptions,
    V2ListRequestBody,
} from './v2.types'

export class UsersV2 {
    constructor(private readonly http: AxiosInstance) {}

    /**
     * Alias for `list`. Returns all users in the organization.
     *
     * @param organizationId - The organization ID
     * @param options - Pagination and sort options
     * @returns Array of `OrganizationUser` objects
     */
    async get(organizationId: string, options?: V2ListOptions): Promise<OrganizationUser[]> {
        return this.list(organizationId, options)
    }

    /**
     * Returns all users in the organization.
     * Automatically paginates through all pages unless `paginate: false` is passed.
     *
     * @param organizationId - The organization ID
     * @param options - Pagination and sort options
     * @returns Array of `OrganizationUser` objects
     */
    async list(organizationId: string, options?: V2ListOptions): Promise<OrganizationUser[]> {
        const baseRequest: V2ListRequestBody = {}

        return PaginationV2.fetchItems<OrganizationUser>(async ({ page, per_page }) => {
            const requestBody = PaginationV2.buildRequestBody(baseRequest, {
                ...options,
                page,
                perPage: per_page,
            })
            const response = await this.http.post(
                `/o/${encodeURIComponent(organizationId)}/users/query`,
                requestBody,
            )
            return response.data as UsersListResponse
        }, options)
    }

    /**
     * Updates an existing user's name, role, policy access, and optionally phone number.
     *
     * @param email - The user's email address (used as the identifier)
     * @param name - The user's display name
     * @param policies - Array of policy IDs the user should have access to
     * @param role - The user's role within the organization
     * @param phone - Optional phone number
     * @returns `UserUpdateResponse` confirming the update
     */
    async update(
        email: string,
        name: string,
        policies: string[],
        role: string,
        phone?: string,
    ): Promise<UserUpdateResponse> {
        const requestBody: UserUpdateRequest = {
            email,
            name,
            role,
            policies,
        }

        if (typeof phone === 'string') {
            requestBody.phone = phone
        }

        const response = await this.http.put('/users', requestBody)
        return response.data as UserUpdateResponse
    }

    /**
     * Removes a user from the organization.
     *
     * @param email - The email address of the user to remove
     * @returns `UserRemoveResponse` confirming the removal
     */
    async remove(email: string): Promise<UserRemoveResponse> {
        const response = await this.http.delete('/users', {
            params: {
                email,
            },
        })
        return response.data as UserRemoveResponse
    }
}
