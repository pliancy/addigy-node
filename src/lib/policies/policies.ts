import { AxiosInstance } from 'axios'
import { Policy } from './policies.types'

export class Policies {
    constructor(private readonly http: AxiosInstance) {}

    async getPolicies(): Promise<Policy[]> {
        try {
            let res = await this.http.get(`policies`)
            return res.data
        } catch (err) {
            throw err
        }
    }

    async getPolicyInstructions(
        policyId: string,
        provider: string = 'ansible-profile',
    ): Promise<Policy[]> {
        try {
            let res = await this.http.get(
                `policies/instructions?provider=${provider}&policy_id=${policyId}`,
            )
            return res.data
        } catch (err) {
            throw err
        }
    }

    async createPolicyInstructions(policyId: string, instructionId: string): Promise<Policy[]> {
        try {
            let res = await this.http.post(`policies/instructions`, {
                instruction_id: instructionId,
                policy_id: policyId,
            })
            return res.data
        } catch (err) {
            throw err
        }
    }

    async deletePolicyInstructions(
        policyId: string,
        instructionId: string,
        provider: string = 'ansible-profile',
    ): Promise<Policy[]> {
        try {
            let res = await this.http.delete(
                `policies/instructions?policy_id=${policyId}&instruction_id=${instructionId}&provider=${provider}`,
            )
            return res.data
        } catch (err) {
            throw err
        }
    }

    async getPolicyDetails(
        policyId: string,
        provider: string = 'ansible-profile',
    ): Promise<object[]> {
        try {
            let res = await this.http.get(
                `policies/details?provider=${provider}&policy_id=${policyId}`,
            )
            return res.data
        } catch (err) {
            throw err
        }
    }

    async createPolicy(
        name: string,
        parentId?: string,
        icon?: string,
        color?: string,
    ): Promise<object[]> {
        let postBody: any = {
            name: name,
        }

        if (icon !== undefined) {
            postBody['icon'] = icon
        }

        if (color !== undefined) {
            postBody['color'] = color
        }

        if (parentId !== undefined) {
            postBody['parent_id'] = parentId
        }

        try {
            let res = await this.http.post(`policies`, postBody)
            return res.data
        } catch (err) {
            throw err
        }
    }
}
