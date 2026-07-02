import { AxiosInstance } from 'axios'
import { PaginationV2 } from './pagination-v2'
import {
    AssetVariableUsage,
    NewVariableRequest,
    Variable,
    VariablePolicies,
    VariablePolicy,
    VariablesListOptions,
    VariablesListResponse,
    VariableUpdateRequest,
    VariableValueResponse,
    V2ListRequestBody,
} from './v2.types'

export interface VariablePoliciesOptions {
    policyId?: string
    variableKey?: string
}

export class VariablesV2 {
    constructor(private readonly http: AxiosInstance) {}

    /**
     * Returns all variables.
     * Automatically paginates through all pages unless `paginate: false` is passed.
     * Supports an optional `filter` to narrow results by key.
     *
     * @param options - Pagination, sort, and filter options
     * @returns Array of `Variable` objects
     */
    async list(options?: VariablesListOptions): Promise<Variable[]> {
        const baseRequest: V2ListRequestBody = {}

        return PaginationV2.fetchItems<Variable>(async ({ page, per_page }) => {
            const requestBody = PaginationV2.buildRequestBody(baseRequest, {
                ...options,
                page,
                perPage: per_page,
            })
            if (options?.filter) {
                requestBody.query = options.filter
            }
            const response = await this.http.post('/oa/variables/query', requestBody)
            return response.data as VariablesListResponse
        }, options)
    }

    /**
     * Creates a new variable.
     *
     * @param organizationId - The organization ID
     * @param request - The variable creation request body
     * @returns The newly created `Variable`
     */
    async create(organizationId: string, request: NewVariableRequest): Promise<Variable> {
        const response = await this.http.post(
            `/o/${encodeURIComponent(organizationId)}/variables`,
            request,
        )
        return response.data as Variable
    }

    /**
     * Updates an existing variable.
     *
     * @param organizationId - The organization ID
     * @param request - The variable update request body
     * @returns The updated `Variable`
     */
    async update(organizationId: string, request: VariableUpdateRequest): Promise<Variable> {
        const response = await this.http.put(
            `/o/${encodeURIComponent(organizationId)}/variables`,
            request,
        )
        return response.data as Variable
    }

    /**
     * Deletes a variable by key.
     *
     * @param organizationId - The organization ID
     * @param key - The variable key to delete
     */
    async delete(organizationId: string, key: string): Promise<void> {
        await this.http.delete(`/o/${encodeURIComponent(organizationId)}/variables`, {
            params: { key },
        })
    }

    /**
     * Returns policy values assigned to variables.
     *
     * @param organizationId - The organization ID
     * @param options - Optional policy ID and variable key filters
     * @returns Array of `VariablePolicies` objects
     */
    async getPolicies(
        organizationId: string,
        options?: VariablePoliciesOptions,
    ): Promise<VariablePolicies[]> {
        const params: Record<string, string> = {}

        if (typeof options?.policyId === 'string') {
            params.policy_id = options.policyId
        }
        if (typeof options?.variableKey === 'string') {
            params.variable_key = options.variableKey
        }

        const path = `/o/${encodeURIComponent(organizationId)}/variables/policies`
        const response =
            Object.keys(params).length > 0
                ? await this.http.get(path, { params })
                : await this.http.get(path)
        return response.data as VariablePolicies[]
    }

    /**
     * Assigns a policy-specific value to a variable.
     *
     * @param organizationId - The organization ID
     * @param request - The policy value assignment request body
     */
    async assignPolicyValue(organizationId: string, request: VariablePolicy): Promise<void> {
        await this.http.post(`/o/${encodeURIComponent(organizationId)}/variables/policies`, request)
    }

    /**
     * Removes a policy-specific value from a variable.
     *
     * @param organizationId - The organization ID
     * @param policyId - The policy ID
     * @param variableKey - The variable key
     */
    async removePolicyValue(
        organizationId: string,
        policyId: string,
        variableKey: string,
    ): Promise<void> {
        await this.http.delete(`/o/${encodeURIComponent(organizationId)}/variables/policies`, {
            params: { policy_id: policyId, variable_key: variableKey },
        })
    }

    /**
     * Gets a policy-specific variable value.
     *
     * @param organizationId - The organization ID
     * @param policyId - The policy ID
     * @param variableKey - The variable key
     * @returns The variable value response
     */
    async getPolicyValue(
        organizationId: string,
        policyId: string,
        variableKey: string,
    ): Promise<VariableValueResponse> {
        const response = await this.http.get(
            `/o/${encodeURIComponent(organizationId)}/variables/policies/value`,
            {
                params: { policy_id: policyId, variable_key: variableKey },
            },
        )
        return response.data as VariableValueResponse
    }

    /**
     * Returns asset usage for a variable.
     *
     * @param organizationId - The organization ID
     * @param variableKey - The variable key
     * @returns Array of `AssetVariableUsage` objects
     */
    async getUsage(organizationId: string, variableKey: string): Promise<AssetVariableUsage[]> {
        const response = await this.http.get(
            `/o/${encodeURIComponent(organizationId)}/variables/usage`,
            {
                params: { variable_key: variableKey },
            },
        )
        return response.data as AssetVariableUsage[]
    }

    /**
     * Gets a variable's default value.
     *
     * @param organizationId - The organization ID
     * @param variableKey - The variable key
     * @returns The variable value response
     */
    async getValue(organizationId: string, variableKey: string): Promise<VariableValueResponse> {
        const response = await this.http.get(
            `/o/${encodeURIComponent(organizationId)}/variables/value`,
            {
                params: { variable_key: variableKey },
            },
        )
        return response.data as VariableValueResponse
    }
}
