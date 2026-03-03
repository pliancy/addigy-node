export interface IAddigyV2Config {
    /** API key used for Addigy v2 `x-api-key` auth */
    apiKey: string
}

export type V2SortDirection = 'asc' | 'desc'

export interface V2ListOptions {
    page?: number
    perPage?: number
    sortField?: string
    sortDirection?: V2SortDirection
    paginate?: boolean
}

export interface V2PaginatedMetadata {
    page?: number
    per_page?: number
    page_count?: number
    total?: number
}

export interface V2PaginatedResponse<T> {
    items?: T[]
    metadata?: V2PaginatedMetadata
}

export type V2ListRequestBody = Record<string, unknown> & {
    page?: number
    per_page?: number
    sort_field?: string
    sort_direction?: V2SortDirection
}

export interface V2PaginationRequest {
    page: number
    per_page: number
}
