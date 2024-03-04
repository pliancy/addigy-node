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

export interface Profile {
    category: string
    commands: string[]
    label: string
    editid: string
    profiles: string[]
    orgid: string
    type: string
    public: boolean
    policy_restricted: boolean
    instructionId: string
    priority?: string
    version?: string
    base_identifier?: string
    remove_script: string
    identifier?: string
    icon: string
    run_on_success: boolean
    tcc_version: number
    software_icon: {
        file_path: string
        file_name: string
        id: string
        filename: string
        provider: string
        md5_hash: string
    }
    description: string
    user_email: string
    downloads: Record<string, unknown>[]
    price_per_device: number
    user_instruction?: string
    scopes: string[]
    firewall_instruction?: string
    name: string
    profile: {
        payload_uuid: string
        payloads: string[]
        payload_identifier: string
        downloads_dir: string
        payload_version: number
        payload_type: string
    }
    installation_script: string
    status_on_skipped: string
    condition: string
    archived: boolean
    provider: string
    dns_instruction: null
}
