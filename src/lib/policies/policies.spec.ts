import { Policies } from './policies'
import axios from 'axios'

jest.mock('axios')

const mockAxios = axios as jest.Mocked<typeof axios>

describe('Policies', () => {
    let policies: Policies

    beforeEach(() => {
        policies = new Policies(mockAxios)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should get all policies', async () => {
        const mockData = [{ id: 'policy1' }, { id: 'policy2' }]
        mockAxios.get.mockResolvedValue({ data: mockData })

        const result = await policies.getPolicies()

        expect(result).toEqual(mockData)
        expect(mockAxios.get).toHaveBeenCalledWith('policies')
    })

    it('should get policy instructions', async () => {
        const mockData = [{ id: 'instruction1' }, { id: 'instruction2' }]
        mockAxios.get.mockResolvedValue({ data: mockData })

        const result = await policies.getPolicyInstructions('policy1')

        expect(result).toEqual(mockData)
        expect(mockAxios.get).toHaveBeenCalledWith(
            'policies/instructions?provider=ansible-profile&policy_id=policy1',
        )
    })

    it('should create policy instructions', async () => {
        const mockData = { id: 'instruction1' }
        mockAxios.post.mockResolvedValue({ data: mockData })

        const result = await policies.createPolicyInstructions('policy1', 'instruction1')

        expect(result).toEqual(mockData)
        expect(mockAxios.post).toHaveBeenCalledWith('policies/instructions', {
            policy_id: 'policy1',
            instruction_id: 'instruction1',
        })
    })

    it('should delete policy instructions', async () => {
        const mockData = [{ id: 'instruction1' }]
        mockAxios.delete.mockResolvedValue({ data: mockData })

        const result = await policies.deletePolicyInstructions('policy1', 'instruction1')

        expect(result).toEqual(mockData)
        expect(mockAxios.delete).toHaveBeenCalledWith(
            'policies/instructions?policy_id=policy1&instruction_id=instruction1&provider=ansible-profile',
        )
    })

    it('should get policy details', async () => {
        const mockData = { id: 'policy1' }
        mockAxios.get.mockResolvedValue({ data: mockData })

        const result = await policies.getPolicyDetails('policy1')

        expect(result).toEqual(mockData)
        expect(mockAxios.get).toHaveBeenCalledWith(
            'policies/details?provider=ansible-profile&policy_id=policy1',
        )
    })

    it('should create a policy', async () => {
        const mockData = { id: 'policy1' }
        mockAxios.post.mockResolvedValue({ data: mockData })

        const result = await policies.createPolicy('policy1')

        expect(result).toEqual(mockData)
        expect(mockAxios.post).toHaveBeenCalledWith('policies', { name: 'policy1' })
    })

    it('should handle errors when getting all policies', async () => {
        mockAxios.get.mockRejectedValue(new Error('error'))

        await expect(policies.getPolicies()).rejects.toThrow('error')
    })

    it('should handle errors when creating policy instructions', async () => {
        mockAxios.post.mockRejectedValue(new Error('error'))

        await expect(policies.createPolicyInstructions('policy1', 'instruction1')).rejects.toThrow(
            'error',
        )
    })

    it('should handle errors when deleting policy instructions', async () => {
        mockAxios.delete.mockRejectedValue(new Error('error'))

        await expect(policies.deletePolicyInstructions('policy1', 'instruction1')).rejects.toThrow(
            'error',
        )
    })

    it('should handle errors when getting policy details', async () => {
        mockAxios.get.mockRejectedValue(new Error('error'))

        await expect(policies.getPolicyDetails('policy1')).rejects.toThrow('error')
    })

    it('should handle errors when creating a policy', async () => {
        mockAxios.post.mockRejectedValue(new Error('error'))

        await expect(policies.createPolicy('policy1')).rejects.toThrow('error')
    })
})
