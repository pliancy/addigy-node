import { DevicesV2 } from './devices-v2'

describe('DevicesV2', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('lists devices across all pages by default', async () => {
        const http = {
            post: jest
                .fn()
                .mockResolvedValueOnce({
                    data: {
                        items: [{ id: 'device-1' }],
                        metadata: { page: 1, per_page: 1, page_count: 2 },
                    },
                })
                .mockResolvedValueOnce({
                    data: {
                        items: [{ id: 'device-2' }],
                        metadata: { page: 2, per_page: 1, page_count: 2 },
                    },
                }),
        }

        const devices = new DevicesV2(http as never)
        const result = await devices.list({ perPage: 1 })

        expect(result).toEqual([{ id: 'device-1' }, { id: 'device-2' }])
        expect(http.post).toHaveBeenNthCalledWith(1, '/devices', {
            page: 1,
            per_page: 1,
        })
        expect(http.post).toHaveBeenNthCalledWith(2, '/devices', {
            page: 2,
            per_page: 1,
        })
    })

})
