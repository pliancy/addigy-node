import { Users } from './users'
import axios from 'axios'
import { IAddigyInternalAuthObject } from '../auth/auth.types'

jest.mock('axios')

const mockAxios = axios as jest.Mocked<typeof axios>
const authObject = { authToken: 'some-auth-token' } as IAddigyInternalAuthObject

describe('Users', () => {
    let users: Users

    beforeEach(() => {
        users = new Users()
        // @ts-ignore
        users['http'] = mockAxios
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('returns empty given no users in response', async () => {
        mockAxios.get.mockResolvedValue({ data: {} })
        await expect(users.getUsers(authObject)).resolves.toEqual([])
    })

    it('gets users', async () => {
        const u = [{ id: 'user1' }]
        mockAxios.get.mockResolvedValue({ data: { users: u } })
        await expect(users.getUsers(authObject)).resolves.toEqual(u)
    })

    it('should create a new user', async () => {
        const mockData = [{ id: 'user1' }]
        mockAxios.post.mockResolvedValue({ data: mockData })

        const result = await users.createUser(authObject, 'email', 'name', ['policy1'], 'role')

        expect(result).toEqual(mockData)
        expect(mockAxios.post).toHaveBeenCalledWith('user', expect.any(Object), {
            headers: {
                Cookie: `auth_token=${authObject.authToken};`,
            },
        })
    })

    it('should update a user', async () => {
        const mockData = [{ id: 'user1', email: 'email' }]
        mockAxios.put.mockResolvedValue({ data: mockData })
        mockAxios.get.mockResolvedValue({ data: { users: mockData } })

        const result = await users.updateUser(authObject, 'email', 'name', ['policy1'], 'role')

        expect(result).toEqual(mockData)
        expect(mockAxios.put).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(Object),
            expect.any(Object),
        )
    })

    it('should delete a user', async () => {
        const mockData = 'ok'
        const usersList = [{ id: 'user1', email: 'email' }]

        mockAxios.delete.mockResolvedValue({ data: mockData })
        mockAxios.get.mockResolvedValue({ data: { users: usersList } })

        const result = await users.deleteUser(authObject, 'email')

        expect(result).toEqual(mockData)
        expect(mockAxios.delete).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
    })

    it('should handle errors when creating a user', async () => {
        mockAxios.post.mockRejectedValue(new Error('error'))

        await expect(
            users.createUser(authObject, 'email', 'name', ['policy1'], 'role'),
        ).rejects.toThrow('error')
    })

    it('should handle errors when updating a user', async () => {
        mockAxios.put.mockRejectedValue(new Error('error'))

        await expect(
            users.updateUser(authObject, 'email', 'name', ['policy1'], 'role'),
        ).rejects.toThrow('error')
    })

    it('should handle errors when deleting a user', async () => {
        mockAxios.delete.mockRejectedValue(new Error('error'))

        await expect(users.deleteUser(authObject, 'email')).rejects.toThrow('error')
    })
})
