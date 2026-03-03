import {
    V2ListOptions,
    V2ListRequestBody,
    V2PaginatedResponse,
    V2PaginationRequest,
} from './v2.types'

export class PaginationV2 {
    private static readonly DEFAULT_PER_PAGE = 100

    static buildRequestBody(baseRequest: V2ListRequestBody, options?: V2ListOptions): V2ListRequestBody {
        const requestBody: V2ListRequestBody = {
            ...baseRequest,
            page: options?.page ?? 1,
            per_page: options?.perPage ?? PaginationV2.DEFAULT_PER_PAGE,
        }

        if (options?.sortField) {
            requestBody.sort_field = options.sortField
        }

        if (options?.sortDirection) {
            requestBody.sort_direction = options.sortDirection
        }

        return requestBody
    }

    static async fetchItems<T>(
        getPage: (request: V2PaginationRequest) => Promise<V2PaginatedResponse<T>>,
        options?: V2ListOptions,
    ): Promise<T[]> {
        const shouldPaginate = options?.paginate ?? true
        const perPage = options?.perPage ?? PaginationV2.DEFAULT_PER_PAGE
        let page = options?.page ?? 1
        const allItems: T[] = []

        for (;;) {
            const response = await getPage({ page, per_page: perPage })
            const items = response?.items ?? []
            const metadata = response?.metadata

            allItems.push(...items)

            if (!shouldPaginate) break

            if (typeof metadata?.page_count === 'number' && page >= metadata.page_count) break

            const effectivePerPage = metadata?.per_page ?? perPage
            if (items.length === 0 || items.length < effectivePerPage) break

            const currentPage = metadata?.page ?? page
            const nextPage = currentPage + 1
            if (nextPage <= page) break

            page = nextPage
        }

        return allItems
    }
}
