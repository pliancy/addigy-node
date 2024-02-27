import { IAddigyInternalAuthObject } from '../../types'
import { AxiosInstance } from 'axios'
import { UserRoles } from './user.types'

export class Users {
    domain = ''

    reqHeaders = {}

    constructor(private readonly http: AxiosInstance) {}

    async createUser(
        authObject: IAddigyInternalAuthObject,
        email: string,
        name: string,
        policies: string[] = [],
        role: UserRoles | string,
        phone?: string,
    ): Promise<object[]> {
        let postBody: any = {
            name: name,
            email: email,
            policies: policies,
            role: role,
        }

        if (phone !== undefined) {
            postBody['phone'] = phone
        }

        try {
            let res = await this.http.post(
                'https://app-prod.addigy.com/api/cloud/users/user',
                postBody,
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                },
            )
            return res.data
        } catch (err) {
            throw err
        }
    }

    async updateUser(
        authObject: IAddigyInternalAuthObject,
        email: string,
        name: string,
        policies: string[] = [],
        role: string,
        phone?: string,
    ): Promise<object[]> {
        let postBody: any = {
            id: '',
            uid: '', // this has to be blank on th PUT for some reason
            name: name,
            authanvil_tfa_username: '',
            email: email,
            phone: '',
            role: role,
            addigy_role: '', // this also has to be blank
            policies: policies,
        }

        if (phone !== undefined) {
            postBody['phone'] = phone
        }

        try {
            // find userId that corresponds to the provided email
            let users: Array<any> = await this.getUsers(authObject)
            let user: any = users.find((element) => element.email === email)
            if (!user) throw new Error(`No user with email ${email} exists.`)

            postBody['id'] = user.id // Addigy requires the user ID to be both in the post body and in the REST URI

            let res = await this.http.put(
                `https://app-prod.addigy.com/api/cloud/users/user/${
                    user.id
                }?user_email=${encodeURIComponent(user.email)}`,
                postBody,
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                },
            )
            return res.data // returns `ok` if successful...
        } catch (err) {
            throw err
        }
    }

    async deleteUser(authObject: IAddigyInternalAuthObject, email: string): Promise<object[]> {
        try {
            // find userId that corresponds to the provided email
            let users: Array<any> = await this.getUsers(authObject)
            let user: any = users.find((element) => element.email === email)
            if (!user) throw new Error(`No user with email ${email} exists.`)

            let res = await this.http.delete(
                `https://app-prod.addigy.com/api/cloud/users/user/${
                    user.id
                }?user_email=${encodeURIComponent(email)}`,
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                },
            )

            return JSON.parse(res.data) // this will return "ok" if successful.
        } catch (err) {
            throw err
        }
    }

    async getUsers(authObject: IAddigyInternalAuthObject): Promise<object[]> {
        try {
            let res = await this.http.get('https://app-prod.addigy.com/api/account', {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    origin: 'https://app-prod.addigy.com',
                },
                method: 'GET',
            })
            return JSON.parse(res.data).users
        } catch (err) {
            throw err
        }
    }
}
