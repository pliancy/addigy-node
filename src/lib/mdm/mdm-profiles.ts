import { IAddigyInternalAuthObject } from '../auth/auth.types'
import { SupportedOsVersions } from '../types'
import { v4 as uuidv4 } from 'uuid'
import plist from '@expo/plist'
import { CustomProfilePayload } from '../profiles/profiles.types'
import axios from 'axios'
import { Urls } from '../addigy.constants'
import { getAxiosHttpAgents } from '../addigy.utils'

export class MdmProfiles {
    private readonly http = axios.create({
        baseURL: `${Urls.appProd}/api/mdm/user/profiles/configurations`,
        ...getAxiosHttpAgents(),
        headers: { origin: Urls.appProd },
    })

    /**
     * Create a custom profile
     * @param authObject - The auth object
     * @param name - The name of the custom profile
     * @param customProfileBase64 - The base64 encoded custom profile
     * @param supportedOsVersions - The supported OS versions -
     * @param payloadScope - The payload scope
     * @param is_profile_signed - Whether the profile is signed
     */
    async createCustomProfile(
        authObject: IAddigyInternalAuthObject,
        name: string,
        customProfileBase64: string,
        supportedOsVersions: SupportedOsVersions,
        payloadScope: 'System' | 'User' = 'System',
        is_profile_signed = false,
    ): Promise<any> {
        const groupUUID = uuidv4()

        const customProfileText = Buffer.from(customProfileBase64, 'base64').toString('utf-8')

        const customProfileJson = plist.parse(customProfileText)
        // Keys for customProfileJson need to be snake_case
        const updateCustomProfileJson = Object.entries(customProfileJson).reduce(
            (acc, [key, value]) => {
                acc[this.toSnakeCase(key)] = value
                return acc
            },
            {} as any,
        )

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
                '/',
                { payloads: [payload] },
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                    },
                },
            )
            return res.data
        } catch (err) {
            throw err
        }
    }

    async createMdmProfile(authObject: IAddigyInternalAuthObject, mdmProfile: any) {
        try {
            let res = await this.http.post(
                '/',
                { payloads: mdmProfile },
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                    },
                },
            )
            return res.data
        } catch (err) {
            throw err
        }
    }

    private toSnakeCase(text: string) {
        // Complex and complete regex string thanks to https://github.com/zellwk/javascript/issues/14
        return text
            .replace(
                /([^\p{L}\d]+|(?<=\p{L})(?=\d)|(?<=\d)(?=\p{L})|(?<=[\p{Ll}\d])(?=\p{Lu})|(?<=\p{Lu})(?=\p{Lu}\p{Ll})|(?<=[\p{L}\d])(?=\p{Lu}\p{Ll}))/gu,
                '_',
            )
            .toLowerCase()
    }
}
