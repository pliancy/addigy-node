import { UsersV2 } from './users-v2'

describe('UsersV2', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('lists users for org and auto paginates', async () => {
        const http = {
            post: jest
                .fn()
                .mockResolvedValueOnce({
                    data: {
                        items: [{ email: 'one@example.com' }],
                        metadata: { page: 1, per_page: 1, page_count: 2 },
                    },
                })
                .mockResolvedValueOnce({
                    data: {
                        items: [{ email: 'two@example.com' }],
                        metadata: { page: 2, per_page: 1, page_count: 2 },
                    },
                }),
        }

        const users = new UsersV2(http as never)
        const result = await users.list('org-1', { perPage: 1 })

        expect(result).toEqual([{ email: 'one@example.com' }, { email: 'two@example.com' }])
        expect(http.post).toHaveBeenNthCalledWith(1, '/o/org-1/users/query', {
            page: 1,
            per_page: 1,
        })
        expect(http.post).toHaveBeenNthCalledWith(2, '/o/org-1/users/query', {
            page: 2,
            per_page: 1,
        })
    })

    it('gets users for org via get alias', async () => {
        const http = {
            post: jest.fn().mockResolvedValue({
                data: {
                    items: [{ email: 'one@example.com' }],
                    metadata: { page: 1, per_page: 100, page_count: 1 },
                },
            }),
        }

        const users = new UsersV2(http as never)
        const result = await users.get('org-1')

        expect(result).toEqual([{ email: 'one@example.com' }])
        expect(http.post).toHaveBeenCalledWith('/o/org-1/users/query', {
            page: 1,
            per_page: 100,
        })
    })

    it('updates user and maps groups to policies', async () => {
        const http = {
            put: jest.fn().mockResolvedValue({ data: { ok: true } }),
        }

        const users = new UsersV2(http as never)
        const result = await users.update(
            'user@example.com',
            'Test User',
            ['policy-1'],
            'admin',
            '5555551212',
        )

        expect(result).toEqual({ ok: true })
        expect(http.put).toHaveBeenCalledWith('/users', {
            email: 'user@example.com',
            name: 'Test User',
            role: 'admin',
            policies: ['policy-1'],
            phone: '5555551212',
        })
    })

    it('removes user by email query param', async () => {
        const http = {
            delete: jest.fn().mockResolvedValue({ data: { ok: true } }),
        }

        const users = new UsersV2(http as never)
        const result = await users.remove('user@example.com')

        expect(result).toEqual({ ok: true })
        expect(http.delete).toHaveBeenCalledWith('/users', {
            params: {
                email: 'user@example.com',
            },
        })
    })

})
