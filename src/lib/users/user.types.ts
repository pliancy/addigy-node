import { Policy } from '../policies/policies.types'

export enum UserRoles {
    Owner = 'power',
    Admin = 'admin',
    User = 'user',
}

export interface User {
    id: string
    uid: string
    name: string
    email: string
    phone: string
    role: UserRoles
    addigy_role: string
    policies: Policy[]
}
