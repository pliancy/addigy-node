import { CertsV2 } from './certs-v2'

describe('CertsV2', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('lists installed certs with auto pagination', async () => {
        const http = {
            post: jest
                .fn()
                .mockResolvedValueOnce({
                    data: {
                        items: [{ id: 'cert-1' }],
                        metadata: { page: 1, per_page: 1, page_count: 2 },
                    },
                })
                .mockResolvedValueOnce({
                    data: {
                        items: [{ id: 'cert-2' }],
                        metadata: { page: 2, per_page: 1, page_count: 2 },
                    },
                }),
        }

        const certs = new CertsV2(http as never)
        const result = await certs.list({ perPage: 1 })

        expect(result).toEqual([{ id: 'cert-1' }, { id: 'cert-2' }])
        expect(http.post).toHaveBeenNthCalledWith(1, '/mdm/certificates/query', {
            page: 1,
            per_page: 1,
        })
        expect(http.post).toHaveBeenNthCalledWith(2, '/mdm/certificates/query', {
            page: 2,
            per_page: 1,
        })
    })

})
