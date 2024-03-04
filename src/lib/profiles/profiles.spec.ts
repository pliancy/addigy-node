import { Profiles } from './profiles'
import axios from 'axios'

jest.mock('axios')

const mockAxios = axios as jest.Mocked<typeof axios>

describe('Profiles', () => {
    let profiles: Profiles

    beforeEach(() => {
        profiles = new Profiles(mockAxios)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should get all profiles', async () => {
        const mockData = [{ id: 'profile1' }, { id: 'profile2' }]
        mockAxios.get.mockResolvedValue({ data: mockData })

        const result = await profiles.getProfiles()

        expect(result).toEqual(mockData)
        expect(mockAxios.get).toHaveBeenCalledWith('profiles')
    })

    it('should get profiles for a specified instructionId', async () => {
        const mockData = [{ id: 'profile1' }]
        mockAxios.get.mockResolvedValue({ data: mockData })

        const result = await profiles.getProfiles('instructionId1')

        expect(result).toEqual(mockData)
        expect(mockAxios.get).toHaveBeenCalledWith('profiles?instruction_id=instructionId1')
    })

    it('should create a new profile', async () => {
        const mockData = { id: 'profile1' }
        const payloads = [{ id: 'payload1' }]
        mockAxios.post.mockResolvedValue({ data: mockData })

        const result = await profiles.createProfile('profile1', payloads)

        expect(result).toEqual(mockData)
        expect(mockAxios.post).toHaveBeenCalledWith('profiles', { name: 'profile1', payloads })
    })

    it('should update a profile', async () => {
        const mockData = { id: 'profile1' }
        const payloads = [{ id: 'payload1' }, { id: 'payload2' }]
        mockAxios.put.mockResolvedValue({ data: mockData })

        const result = await profiles.updateProfile('instructionId1', payloads)

        expect(result).toEqual(mockData)
        expect(mockAxios.put).toHaveBeenCalledWith('profiles', {
            instruction_id: 'instructionId1',
            payloads,
        })
    })

    it('should delete a profile', async () => {
        const mockData = [{ id: 'profile1' }]
        mockAxios.delete.mockResolvedValue({ data: mockData })

        const result = await profiles.deleteProfile('instructionId1')

        expect(result).toEqual(mockData)
        expect(mockAxios.delete).toHaveBeenCalledWith('profiles', {
            params: { instruction_id: 'instructionId1' },
        })
    })

    it('should handle errors when getting profiles', async () => {
        mockAxios.get.mockRejectedValue(new Error('error'))

        await expect(profiles.getProfiles()).rejects.toThrow('error')
    })

    it('should handle errors when creating a profile', async () => {
        const payloads = [{ id: 'payload1' }]
        mockAxios.post.mockRejectedValue(new Error('error'))

        await expect(profiles.createProfile('profile1', payloads)).rejects.toThrow('error')
    })

    it('should handle errors when updating a profile', async () => {
        const payloads = [{ id: 'payload1' }, { id: 'payload2' }]
        mockAxios.put.mockRejectedValue(new Error('error'))

        await expect(profiles.updateProfile('instructionId1', payloads)).rejects.toThrow('error')
    })

    it('should handle errors when deleting a profile', async () => {
        mockAxios.delete.mockRejectedValue(new Error('error'))

        await expect(profiles.deleteProfile('instructionId1')).rejects.toThrow('error')
    })
})
