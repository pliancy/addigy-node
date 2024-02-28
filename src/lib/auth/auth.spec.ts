import { Auth } from './auth'
import axios from 'axios'
import { IAddigyConfig } from '../types'
import { IAddigyInternalAuthObject } from './auth.types'

jest.mock('axios')

describe('Auth', () => {
    let auth: Auth

    const config = {
        adminUsername: 'username',
        adminPassword: 'password',
    } as IAddigyConfig

    beforeEach(() => {
        auth = new Auth(config)
        // @ts-ignore
        auth['http'] = axios
    })

    describe('getAuthObject', () => {
        it('should return auth object on successful call', async () => {
            // Mock successful axios response
            ;(axios.post as jest.Mock).mockResolvedValue({
                data: {
                    orgid: 'testOrgId',
                    authtoken: 'testAuthToken',
                    email: 'test@example.com',
                },
            })
            config.adminUsername = 'username'
            config.adminPassword = 'password'
            const result = await auth.getAuthObject()

            expect(result).toEqual({
                orgId: 'testOrgId',
                authToken: 'testAuthToken',
                emailAddress: 'test@example.com',
            })
        })

        it('should throw error when admin username and password are not provided', async () => {
            ;(axios.post as jest.Mock).mockResolvedValue({})
            config.adminUsername = ''
            config.adminPassword = ''

            await expect(auth.getAuthObject()).rejects.toEqual(
                new Error(
                    "The function you are using hits Addigy's internal API, but no username or " +
                        'password was provided in the constructor. Please fill out the adminUsername and ' +
                        'adminPassword parameters.',
                ),
            )
        })

        it('should throw error when request fails', async () => {
            ;(axios.post as jest.Mock).mockRejectedValue(new Error('Request failed.'))
            config.adminUsername = 'username'
            config.adminPassword = 'password'

            await expect(auth.getAuthObject()).rejects.toEqual(new Error('Request failed.'))
        })
    })

    describe('getImpersonationAuthObject', () => {
        it('should return auth object on successful impersonation', async () => {
            // Mock successful axios response
            ;(axios.post as jest.Mock).mockResolvedValue({
                headers: {
                    'set-cookie': ['prod_auth_token=impersonatedAuthToken;'],
                },
            })
            const authObject: IAddigyInternalAuthObject = {
                orgId: 'orgId',
                authToken: 'authToken',
                emailAddress: 'emailAddress',
            }
            // Assuming the Auth object is instantiated like this.
            const result = await auth.getImpersonationAuthObject(authObject, 'impersonatedOrgId')

            expect(result).toEqual({
                orgId: 'impersonatedOrgId',
                authToken: 'impersonatedAuthToken',
                emailAddress: 'emailAddress',
            })
        })

        it('should throw error when no set-cookie found in response', async () => {
            ;(axios.post as jest.Mock).mockResolvedValue({ headers: {} })
            const authObject: IAddigyInternalAuthObject = {
                orgId: 'orgId',
                authToken: 'authToken',
                emailAddress: 'emailAddress',
            }

            await expect(
                auth.getImpersonationAuthObject(authObject, 'impersonatedOrgId'),
            ).rejects.toEqual(new Error('No set-cookie found in response'))
        })

        it('should throw error when no auth cookie found', async () => {
            ;(axios.post as jest.Mock).mockResolvedValue({
                headers: {
                    'set-cookie': ['other_cookie=some_value;'],
                },
            })

            const authObject: IAddigyInternalAuthObject = {
                orgId: 'orgId',
                authToken: 'authToken',
                emailAddress: 'emailAddress',
            }

            await expect(
                auth.getImpersonationAuthObject(authObject, 'impersonatedOrgId'),
            ).rejects.toEqual(new Error('No auth cookie found'))
        })

        it('should throw an error when no token found in cookie', async () => {
            ;(axios.post as jest.Mock).mockResolvedValue({
                headers: {
                    'set-cookie': ['prod_auth_token;'],
                },
            })

            const authObject: IAddigyInternalAuthObject = {
                orgId: 'orgId',
                authToken: 'authToken',
                emailAddress: 'emailAddress',
            }

            await expect(
                auth.getImpersonationAuthObject(authObject, 'impersonatedOrgId'),
            ).rejects.toEqual(new Error('No token found in cookie'))
        })

        it('should throw error when request fails', async () => {
            ;(axios.post as jest.Mock).mockRejectedValue(new Error('Request failed.'))
            const authObject: IAddigyInternalAuthObject = {
                orgId: 'orgId',
                authToken: 'authToken',
                emailAddress: 'emailAddress',
            }

            await expect(
                auth.getImpersonationAuthObject(authObject, 'impersonatedOrgId'),
            ).rejects.toEqual(new Error('Request failed.'))
        })
    })
})
