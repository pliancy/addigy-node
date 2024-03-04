import { Software } from './software'
import axios from 'axios'
import { IAddigyInternalAuthObject } from '../auth/auth.types'
import { CreateSoftware } from './software.types'
import { Urls } from '../addigy.constants'

jest.mock('axios')

const mockAxios = axios as jest.Mocked<typeof axios>

describe('Software', () => {
    let software: Software

    const authObject = {
        authToken: 'authToken',
    } as IAddigyInternalAuthObject

    const softwareData = {} as CreateSoftware

    beforeEach(() => {
        software = new Software(mockAxios)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should get public software', async () => {
        const mockData = [{ id: 'software1' }, { id: 'software2' }]
        mockAxios.get.mockResolvedValue({ data: mockData })

        const result = await software.getPublicSoftware()

        expect(result).toEqual(mockData)
        expect(mockAxios.get).toHaveBeenCalledWith('catalog/public')
    })

    it('should get custom software', async () => {
        const mockData = [{ id: 'software1' }, { id: 'software2' }]
        mockAxios.get.mockResolvedValue({ data: mockData })

        const result = await software.getCustomSoftware()

        expect(result).toEqual(mockData)
        expect(mockAxios.get).toHaveBeenCalledWith('custom-software')
    })

    it('should create a new custom software', async () => {
        const mockData = { success: true }
        mockAxios.post.mockResolvedValue({ data: mockData })

        const result = await software.createCustomSoftware(
            'identifier',
            'version',
            ['download1', 'download2'],
            'installScript',
            'condition',
            'removeScript',
        )

        expect(result).toEqual(mockData)
        expect(mockAxios.post).toHaveBeenCalledWith('custom-software', expect.any(Object))
    })

    it('should create software internal', async () => {
        const mockData = { success: true }
        mockAxios.post.mockResolvedValue({ data: mockData })

        const result = await software.createSoftwareInternal(authObject, softwareData)

        expect(result).toEqual(mockData)
        expect(mockAxios.post).toHaveBeenCalledWith('software', softwareData, {
            headers: {
                Cookie: `auth_token=${authObject.authToken};`,
                origin: Urls.appProd,
            },
        })
    })

    it('should handle errors when getting public software', async () => {
        mockAxios.get.mockRejectedValue(new Error('error'))

        await expect(software.getPublicSoftware()).rejects.toThrow('error')
    })

    it('should handle errors when getting custom software', async () => {
        mockAxios.get.mockRejectedValue(new Error('error'))

        await expect(software.getCustomSoftware()).rejects.toThrow('error')
    })

    it('should handle errors when creating a new custom software', async () => {
        mockAxios.post.mockRejectedValue(new Error('error'))

        await expect(
            software.createCustomSoftware(
                'baseIdentifier',
                'version',
                ['download1', 'download2'],
                'installScript',
                'condition',
                'removeScript',
            ),
        ).rejects.toThrow('error')
    })

    it('should handle errors when creating software internally', async () => {
        const newSoftwareDataInternal = {} as CreateSoftware

        mockAxios.post.mockRejectedValue(new Error('error'))

        await expect(
            software.createSoftwareInternal(authObject, newSoftwareDataInternal),
        ).rejects.toThrow('error')
    })
})
