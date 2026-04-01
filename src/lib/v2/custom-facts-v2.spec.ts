import { CustomFactsV2 } from './custom-facts-v2'

describe('CustomFactsV2', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('lists custom facts across all pages by default', async () => {
        const http = {
            post: jest
                .fn()
                .mockResolvedValueOnce({
                    data: {
                        items: [{ identifier: 'fact-1' }],
                        metadata: { page: 1, per_page: 1, page_count: 2 },
                    },
                })
                .mockResolvedValueOnce({
                    data: {
                        items: [{ identifier: 'fact-2' }],
                        metadata: { page: 2, per_page: 1, page_count: 2 },
                    },
                }),
        }

        const customFacts = new CustomFactsV2(http as never)
        const result = await customFacts.list({ perPage: 1 })

        expect(result).toEqual([{ identifier: 'fact-1' }, { identifier: 'fact-2' }])
        expect(http.post).toHaveBeenNthCalledWith(1, '/oa/facts/custom/query', {
            page: 1,
            per_page: 1,
        })
        expect(http.post).toHaveBeenNthCalledWith(2, '/oa/facts/custom/query', {
            page: 2,
            per_page: 1,
        })
    })

    it('passes filter as query in list request body', async () => {
        const http = {
            post: jest.fn().mockResolvedValueOnce({
                data: {
                    items: [{ identifier: 'fact-1' }],
                    metadata: { page: 1, per_page: 100, page_count: 1 },
                },
            }),
        }

        const customFacts = new CustomFactsV2(http as never)
        await customFacts.list({ filter: { name_contains: 'cpu' } })

        expect(http.post).toHaveBeenCalledWith('/oa/facts/custom/query', {
            page: 1,
            per_page: 100,
            query: { name_contains: 'cpu' },
        })
    })

    it('gets a custom fact by id', async () => {
        const mockFact = { identifier: 'fact-1', name: 'CPU Usage' }
        const http = {
            get: jest.fn().mockResolvedValue({ data: mockFact }),
        }

        const customFacts = new CustomFactsV2(http as never)
        const result = await customFacts.get('org-123', 'fact-1')

        expect(result).toEqual(mockFact)
        expect(http.get).toHaveBeenCalledWith('/o/org-123/facts/custom/fact-1')
    })

    it('gets custom fact usage', async () => {
        const mockUsage = { policies: [{ id: 'p-1', name: 'Policy 1', parent_id: null }] }
        const http = {
            get: jest.fn().mockResolvedValue({ data: mockUsage }),
        }

        const customFacts = new CustomFactsV2(http as never)
        const result = await customFacts.getUsage('org-123', 'fact-1')

        expect(result).toEqual(mockUsage)
        expect(http.get).toHaveBeenCalledWith('/o/org-123/facts/custom/fact-1/usage')
    })

    it('creates a custom fact', async () => {
        const mockResponse = { fact: { identifier: 'fact-new', name: 'My Fact' } }
        const http = {
            post: jest.fn().mockResolvedValue({ data: mockResponse }),
        }

        const customFacts = new CustomFactsV2(http as never)
        const request = { name: 'My Fact', return_type: 'string' }
        const result = await customFacts.create('org-123', request)

        expect(result).toEqual(mockResponse)
        expect(http.post).toHaveBeenCalledWith('/o/org-123/facts/custom', request)
    })

    it('updates a custom fact', async () => {
        const http = {
            put: jest.fn().mockResolvedValue({ data: {} }),
        }

        const customFacts = new CustomFactsV2(http as never)
        const request = { id: 'fact-1', name: 'Updated Name' }
        await customFacts.update('org-123', request)

        expect(http.put).toHaveBeenCalledWith('/o/org-123/facts/custom', request)
    })

    it('deletes a custom fact', async () => {
        const http = {
            delete: jest.fn().mockResolvedValue({ data: {} }),
        }

        const customFacts = new CustomFactsV2(http as never)
        await customFacts.delete('org-123', 'fact-1')

        expect(http.delete).toHaveBeenCalledWith('/o/org-123/facts/custom', {
            params: { id: 'fact-1' },
        })
    })

    it('assigns policies to a custom fact', async () => {
        const mockResponse = { succeeded: ['p-1'], failed: [] }
        const http = {
            post: jest.fn().mockResolvedValue({ data: mockResponse }),
        }

        const customFacts = new CustomFactsV2(http as never)
        const result = await customFacts.assignPolicies('org-123', 'fact-1', ['p-1'])

        expect(result).toEqual(mockResponse)
        expect(http.post).toHaveBeenCalledWith('/o/org-123/facts/custom/policy', {
            id: 'fact-1',
            policies: ['p-1'],
        })
    })

    it('unassigns a policy from a custom fact', async () => {
        const http = {
            delete: jest.fn().mockResolvedValue({ data: {} }),
        }

        const customFacts = new CustomFactsV2(http as never)
        await customFacts.unassignPolicy('org-123', 'fact-1', 'p-1')

        expect(http.delete).toHaveBeenCalledWith('/o/org-123/facts/custom/policy', {
            params: { id: 'fact-1', policy_id: 'p-1' },
        })
    })
})
