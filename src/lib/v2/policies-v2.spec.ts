import { PoliciesV2 } from './policies-v2'

describe('PoliciesV2', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('lists policies and auto paginates', async () => {
        const http = {
            post: jest
                .fn()
                .mockResolvedValueOnce({
                    data: {
                        items: [{ id: 'policy-1' }],
                        metadata: { page: 1, per_page: 1, page_count: 2 },
                    },
                })
                .mockResolvedValueOnce({
                    data: {
                        items: [{ id: 'policy-2' }],
                        metadata: { page: 2, per_page: 1, page_count: 2 },
                    },
                }),
        }

        const policies = new PoliciesV2(http as never)
        const result = await policies.list({ perPage: 1 })

        expect(result).toEqual([{ id: 'policy-1' }, { id: 'policy-2' }])
        expect(http.post).toHaveBeenNthCalledWith(1, '/oa/policies/query', {
            page: 1,
            per_page: 1,
        })
        expect(http.post).toHaveBeenNthCalledWith(2, '/oa/policies/query', {
            page: 2,
            per_page: 1,
        })
    })

    it('creates policy with provided name', async () => {
        const http = {
            post: jest.fn().mockResolvedValue({ data: { id: 'policy-new' } }),
        }

        const policies = new PoliciesV2(http as never)
        const result = await policies.create('My Policy')

        expect(result).toEqual({ id: 'policy-new' })
        expect(http.post).toHaveBeenCalledWith('/policies', { name: 'My Policy' })
    })
})
