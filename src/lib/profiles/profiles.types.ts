import { Payload, SupportedOsVersions } from '../types'

export interface CustomProfilePayload extends Payload {
    is_profile_signed: boolean
    custom_profile_content: string
    decoded_profile_content: string
    supported_os_versions: SupportedOsVersions
    payload_scope: 'System' | 'User'
    profile_json_data: CustomProfileJSONData[]
}

export interface CustomProfileJSONData {
    payload_identifier: string
    payload_removal_disallowed: boolean
    payload_scope: string
    payload_type: string
    payload_uuid: string
    payload_organization: string
    payload_version: number
    payload_display_name: string
    payload_content: any[]
}
