import { PoliciesV2 } from './policies-v2'

describe('PoliciesV2', () => {
    const makePolicies = (
        http: Record<string, jest.Mock>,
        internalHttp: Record<string, jest.Mock> = { get: jest.fn() },
    ) => new PoliciesV2(http as never, internalHttp as never)

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

        const policies = makePolicies(http)
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

        const policies = makePolicies(http)
        const result = await policies.list(['aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'])

        expect(result).toEqual([{ id: 'policy-1' }])
        expect(http.post).toHaveBeenCalledWith('/oa/policies/query', {
            policies: ['aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'],
        })
    })

    it('gets a policy from the internal policy detail endpoint', async () => {
        const http = { post: jest.fn() }
        const internalHttp = {
            get: jest.fn().mockResolvedValue({
                data: {
                    policyId: 'policy-1',
                    instructions: ['instruction-1'],
                },
            }),
        }

        const policies = makePolicies(http, internalHttp)
        const result = await policies.get('policy-1')

        expect(result).toEqual({
            policyId: 'policy-1',
            instructions: ['instruction-1'],
        })
        expect(internalHttp.get).toHaveBeenCalledWith('/policies/policy-1')
    })

    it('creates policy with provided name', async () => {
        const http = {
            post: jest.fn().mockResolvedValue({ data: { id: 'policy-new' } }),
        }

        const policies = makePolicies(http)
        const result = await policies.create('My Policy')

        expect(result).toEqual({ id: 'policy-new' })
        expect(http.post).toHaveBeenCalledWith('/policies', { name: 'My Policy' })
    })
})
