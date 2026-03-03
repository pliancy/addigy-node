import { PaginationV2 } from './pagination-v2'

describe('PaginationV2', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('builds request body with defaults', () => {
        const requestBody = PaginationV2.buildRequestBody({}, undefined)

        expect(requestBody).toEqual({
            page: 1,
            per_page: 100,
        })
    })

    it('fetches all pages using page_count metadata', async () => {
        const getPage = jest
            .fn()
            .mockResolvedValueOnce({
                items: [{ id: 1 }],
                metadata: { page: 1, per_page: 1, page_count: 2 },
            })
            .mockResolvedValueOnce({
                items: [{ id: 2 }],
                metadata: { page: 2, per_page: 1, page_count: 2 },
            })

        const results = await PaginationV2.fetchItems(getPage, { perPage: 1 })

        expect(results).toEqual([{ id: 1 }, { id: 2 }])
        expect(getPage).toHaveBeenCalledTimes(2)
        expect(getPage).toHaveBeenNthCalledWith(1, { page: 1, per_page: 1 })
        expect(getPage).toHaveBeenNthCalledWith(2, { page: 2, per_page: 1 })
    })

    it('stops on short page when metadata has no page_count', async () => {
        const getPage = jest
            .fn()
            .mockResolvedValueOnce({
                items: [{ id: 1 }, { id: 2 }],
                metadata: { page: 1, per_page: 2 },
            })
            .mockResolvedValueOnce({
                items: [{ id: 3 }],
                metadata: { page: 2, per_page: 2 },
            })

        const results = await PaginationV2.fetchItems(getPage, { perPage: 2 })

        expect(results).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
        expect(getPage).toHaveBeenCalledTimes(2)
    })

    it('fetches only one page when pagination is disabled', async () => {
        const getPage = jest.fn().mockResolvedValue({
            items: [{ id: 1 }],
            metadata: { page: 1, per_page: 100, page_count: 10 },
        })

        const results = await PaginationV2.fetchItems(getPage, { paginate: false })

        expect(results).toEqual([{ id: 1 }])
        expect(getPage).toHaveBeenCalledTimes(1)
        expect(getPage).toHaveBeenCalledWith({ page: 1, per_page: 100 })
    })
})
