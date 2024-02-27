import { AxiosInstance } from 'axios'
import { CustomProfilePayload, IAddigyInternalAuthObject, SupportedOsVersions } from '../../types'
import { v4 as uuidv4 } from 'uuid'
import plist from '@expo/plist'
import { toSnakeCase } from '../../util'

export class Profiles {
    domain = ''

    reqHeaders = {}

    constructor(private readonly http: AxiosInstance) {}

    async getProfiles(instructionId?: string): Promise<object[]> {
        let instructionUri = ''
        if (instructionId !== undefined) {
            instructionUri = `?instruction_id=${instructionId}`
        }

        try {
            let res = await this.http.get(`${this.domain}/profiles` + instructionUri, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }

    async createProfile(name: string, payloads: object[]): Promise<object[]> {
        let postBody: any = {
            name: name,
            payloads: payloads,
        }

        try {
            let res = await this.http.post(`${this.domain}/profiles`, postBody, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }

    async updateProfile(instructionId: string, payloads: object[]): Promise<object[]> {
        let postBody: any = {
            instruction_id: instructionId,
            payloads: payloads,
        }

        try {
            let res = await this.http.put(`${this.domain}/profiles`, postBody, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }

    async deleteProfile(instructionId: string): Promise<object[]> {
        try {
            let res = await this.http.delete(`${this.domain}/profiles`, {
                params: { instruction_id: instructionId },
                headers: this.reqHeaders,
            })
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }

    async createCustomProfile(
        authObject: IAddigyInternalAuthObject,
        name: string,
        customProfileText: string,
        supportedOsVersions: SupportedOsVersions,
        payloadScope: 'System' | 'User' = 'System',
        is_profile_signed = false,
    ): Promise<any> {
        const groupUUID = uuidv4()

        const customProfileJson = plist.parse(customProfileText)
        // Keys for customProfileJson need to be snake_case
        const updateCustomProfileJson = Object.entries(customProfileJson).reduce(
            (acc, [key, value]) => {
                acc[toSnakeCase(key)] = value
                return acc
            },
            {} as any,
        )
        const customProfileBase64 = Buffer.from(customProfileText).toString('base64')

        const payload: CustomProfilePayload = {
            addigy_payload_type: 'com.addigy.custom.mdm.payload',
            payload_type: 'custom',
            payload_version: 1,
            payload_identifier: `com.addigy.custom.mdm.payload.${groupUUID}`,
            payload_uuid: `custom-profile-${uuidv4()}`,
            payload_group_id: groupUUID,
            payload_display_name: name,
            is_profile_signed,
            profile_json_data: updateCustomProfileJson,
            decoded_profile_content: customProfileText,
            custom_profile_content: customProfileBase64,
            supported_os_versions: supportedOsVersions,
            payload_scope: payloadScope,
        }

        try {
            let res = await this.http.post(
                'https://app-prod.addigy.com/api/mdm/user/profiles/configurations',
                { payloads: [payload] },
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                },
            )
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }

    async createMdmProfile(authObject: IAddigyInternalAuthObject, mdmProfile: any) {
        try {
            let res = await this.http.post(
                'https://app-prod.addigy.com/api/mdm/user/profiles/configurations',
                { payloads: mdmProfile },
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                },
            )
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }
}
