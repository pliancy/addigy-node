import { SmartSoftwareV2 } from './smart-software-v2'

describe('SmartSoftwareV2', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('lists smart software across all pages by default', async () => {
        const http = {
            post: jest
                .fn()
                .mockResolvedValueOnce({
                    data: {
                        items: [{ instruction_id: 'sw-1' }],
                        metadata: { page: 1, per_page: 1, page_count: 2 },
                    },
                })
                .mockResolvedValueOnce({
                    data: {
                        items: [{ instruction_id: 'sw-2' }],
                        metadata: { page: 2, per_page: 1, page_count: 2 },
                    },
                }),
        }

        const smartSoftware = new SmartSoftwareV2(http as never)
        const result = await smartSoftware.list({ perPage: 1 })

        expect(result).toEqual([{ instruction_id: 'sw-1' }, { instruction_id: 'sw-2' }])
        expect(http.post).toHaveBeenNthCalledWith(1, '/oa/smart-software/query', {
            page: 1,
            per_page: 1,
            sort_field: 'name',
            sort_direction: 'asc',
        })
        expect(http.post).toHaveBeenNthCalledWith(2, '/oa/smart-software/query', {
            page: 2,
            per_page: 1,
            sort_field: 'name',
            sort_direction: 'asc',
        })
    })

    it('passes filter as query in request body', async () => {
        const http = {
            post: jest.fn().mockResolvedValueOnce({
                data: {
                    items: [{ instruction_id: 'sw-1', name: 'My App' }],
                    metadata: { page: 1, per_page: 10, page_count: 1 },
                },
            }),
        }

        const smartSoftware = new SmartSoftwareV2(http as never)
        const filter = { name_contains: 'My App' }
        const result = await smartSoftware.list({ filter })

        expect(result).toEqual([{ instruction_id: 'sw-1', name: 'My App' }])
        expect(http.post).toHaveBeenCalledWith('/oa/smart-software/query', {
            page: 1,
            per_page: 100,
            query: filter,
            sort_field: 'name',
            sort_direction: 'asc',
        })
    })
})
