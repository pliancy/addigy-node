import { VariablesV2 } from './variables-v2'

describe('VariablesV2', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('lists variables across all pages by default', async () => {
        const http = {
            post: jest
                .fn()
                .mockResolvedValueOnce({
                    data: {
                        items: [{ key: 'one' }],
                        metadata: { page: 1, per_page: 1, page_count: 2 },
                    },
                })
                .mockResolvedValueOnce({
                    data: {
                        items: [{ key: 'two' }],
                        metadata: { page: 2, per_page: 1, page_count: 2 },
                    },
                }),
        }

        const variables = new VariablesV2(http as never)
        const result = await variables.list({ perPage: 1 })

        expect(result).toEqual([{ key: 'one' }, { key: 'two' }])
        expect(http.post).toHaveBeenNthCalledWith(1, '/oa/variables/query', {
            page: 1,
            per_page: 1,
        })
        expect(http.post).toHaveBeenNthCalledWith(2, '/oa/variables/query', {
            page: 2,
            per_page: 1,
        })
    })

    it('passes filter as query in list request body', async () => {
        const http = {
            post: jest.fn().mockResolvedValueOnce({
                data: {
                    items: [{ key: 'device_name' }],
                    metadata: { page: 1, per_page: 100, page_count: 1 },
                },
            }),
        }

        const variables = new VariablesV2(http as never)
        await variables.list({ filter: { key_contains: 'device' } })

        expect(http.post).toHaveBeenCalledWith('/oa/variables/query', {
            page: 1,
            per_page: 100,
            query: { key_contains: 'device' },
        })
    })

    it('creates a variable', async () => {
        const mockVariable = { key: 'device_name', type: 'string', default_value: 'Mac' }
        const http = {
            post: jest.fn().mockResolvedValue({ data: mockVariable }),
        }

        const variables = new VariablesV2(http as never)
        const request = { key: 'device_name', type: 'string' as const, default_value: 'Mac' }
        const result = await variables.create('org-123', request)

        expect(result).toEqual(mockVariable)
        expect(http.post).toHaveBeenCalledWith('/o/org-123/variables', request)
    })

    it('updates a variable', async () => {
        const mockVariable = { key: 'device_name', type: 'string', default_value: 'MacBook' }
        const http = {
            put: jest.fn().mockResolvedValue({ data: mockVariable }),
        }

        const variables = new VariablesV2(http as never)
        const request = { key: 'device_name', default_value: 'MacBook' }
        const result = await variables.update('org-123', request)

        expect(result).toEqual(mockVariable)
        expect(http.put).toHaveBeenCalledWith('/o/org-123/variables', request)
    })

    it('deletes a variable by key', async () => {
        const http = {
            delete: jest.fn().mockResolvedValue({ data: {} }),
        }

        const variables = new VariablesV2(http as never)
        await variables.delete('org-123', 'device_name')

        expect(http.delete).toHaveBeenCalledWith('/o/org-123/variables', {
            params: { key: 'device_name' },
        })
    })

    it('gets variable policy values with optional filters', async () => {
        const mockPolicies = [
            {
                variable_key: 'device_name',
                policy_values: [{ policy_id: 'policy-1', value: 'Mac' }],
            },
        ]
        const http = {
            get: jest.fn().mockResolvedValue({ data: mockPolicies }),
        }

        const variables = new VariablesV2(http as never)
        const result = await variables.getPolicies('org-123', {
            policyId: 'policy-1',
            variableKey: 'device_name',
        })

        expect(result).toEqual(mockPolicies)
        expect(http.get).toHaveBeenCalledWith('/o/org-123/variables/policies', {
            params: { policy_id: 'policy-1', variable_key: 'device_name' },
        })
    })

    it('gets variable policy values without filters', async () => {
        const http = {
            get: jest.fn().mockResolvedValue({ data: [] }),
        }

        const variables = new VariablesV2(http as never)
        const result = await variables.getPolicies('org-123')

        expect(result).toEqual([])
        expect(http.get).toHaveBeenCalledWith('/o/org-123/variables/policies')
    })

    it('assigns a policy value to a variable', async () => {
        const http = {
            post: jest.fn().mockResolvedValue({ data: {} }),
        }

        const variables = new VariablesV2(http as never)
        const request = { policy_id: 'policy-1', variable_key: 'device_name', value: 'Mac' }
        await variables.assignPolicyValue('org-123', request)

        expect(http.post).toHaveBeenCalledWith('/o/org-123/variables/policies', request)
    })

    it('removes a policy value from a variable', async () => {
        const http = {
            delete: jest.fn().mockResolvedValue({ data: {} }),
        }

        const variables = new VariablesV2(http as never)
        await variables.removePolicyValue('org-123', 'policy-1', 'device_name')

        expect(http.delete).toHaveBeenCalledWith('/o/org-123/variables/policies', {
            params: { policy_id: 'policy-1', variable_key: 'device_name' },
        })
    })

    it('gets a variable policy value', async () => {
        const mockValue = { value: 'Mac' }
        const http = {
            get: jest.fn().mockResolvedValue({ data: mockValue }),
        }

        const variables = new VariablesV2(http as never)
        const result = await variables.getPolicyValue('org-123', 'policy-1', 'device_name')

        expect(result).toEqual(mockValue)
        expect(http.get).toHaveBeenCalledWith('/o/org-123/variables/policies/value', {
            params: { policy_id: 'policy-1', variable_key: 'device_name' },
        })
    })

    it('gets variable usage', async () => {
        const mockUsage = [
            {
                asset_ids: ['asset-1'],
                asset_type: 'policy',
                organization_id: 'org-123',
                variable_key: 'device_name',
            },
        ]
        const http = {
            get: jest.fn().mockResolvedValue({ data: mockUsage }),
        }

        const variables = new VariablesV2(http as never)
        const result = await variables.getUsage('org-123', 'device_name')

        expect(result).toEqual(mockUsage)
        expect(http.get).toHaveBeenCalledWith('/o/org-123/variables/usage', {
            params: { variable_key: 'device_name' },
        })
    })

    it('gets a variable value', async () => {
        const mockValue = { value: 'Mac' }
        const http = {
            get: jest.fn().mockResolvedValue({ data: mockValue }),
        }

        const variables = new VariablesV2(http as never)
        const result = await variables.getValue('org-123', 'device_name')

        expect(result).toEqual(mockValue)
        expect(http.get).toHaveBeenCalledWith('/o/org-123/variables/value', {
            params: { variable_key: 'device_name' },
        })
    })
})
