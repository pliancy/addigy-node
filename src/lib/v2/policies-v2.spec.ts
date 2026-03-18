import { PoliciesV2 } from './policies-v2'

describe('PoliciesV2', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('lists policies from items response', async () => {
        const http = {
            post: jest.fn().mockResolvedValue({
                data: {
                    items: [{ id: 'policy-1' }, { id: 'policy-2' }],
                },
            }),
        }

        const policies = new PoliciesV2(http as never)
        const result = await policies.list()

        expect(result).toEqual([{ id: 'policy-1' }, { id: 'policy-2' }])
        expect(http.post).toHaveBeenCalledWith('/oa/policies/query', {})
    })

    it('lists policies with policy filter', async () => {
        const http = {
            post: jest.fn().mockResolvedValue({
                data: {
                    items: [{ id: 'policy-1' }],
                },
            }),
        }

        const policies = new PoliciesV2(http as never)
        const result = await policies.list(['aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'])

        expect(result).toEqual([{ id: 'policy-1' }])
        expect(http.post).toHaveBeenCalledWith('/oa/policies/query', {
            policies: ['aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'],
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
