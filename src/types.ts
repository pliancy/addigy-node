/**
 * The Config for the Addigy class
 * This interface allows utilization of Addigy's internal API by using credentials of an actual user account
 * @export
 * @interface IAddigyConfig
 */
export interface IAddigyConfig {
    /** the API credentials from Addigy */
    clientId: string
    clientSecret: string
    /** user account credentials with owner/power user role */
    adminUsername?: string
    adminPassword?: string
}

/*
 * Various combinations of the auth token, organization ID, and email address of the callee are
 * required for different calls to Addigy's internal API endpoints. To make things easier,
 * they are all packaged together into a single authentication object
 */
export interface IAddigyInternalAuthObject {
    orgId: string
    authToken: string
    emailAddress: string
}

export interface Payload {
    addigy_payload_type:
        | 'com.addigy.syspolicy.system-extension-policy.com.apple.system-extension-policy'
        | 'com.addigy.TCC.configuration-profile-policy.com.apple.TCC.configuration-profile-policy'
        | 'com.addigy.syspolicy.kernel-extension-policy.com.apple.syspolicy.kernel-extension-policy'
    payload_type:
        | 'com.apple.system-extension-policy'
        | 'com.apple.syspolicy.kernel-extension-policy'
        | 'com.apple.TCC.configuration-profile-policy'
    payload_version: number
    payload_identifier: string
    payload_uuid: string
    payload_group_id: string
    payload_display_name: string
}

export interface SystemExtensionPayload extends Payload {
    payload_enabled: boolean
    allowed_system_extensions: any
    allowed_system_extensions_types: any
    allowed_team_identifiers: string[]
    allow_user_overrides: boolean
}

export interface KernalExtensionPayload extends Payload {
    payload_enabled: boolean
    allow_user_overrides: boolean
    allowed_kernel_extensions: any
    allowed_team_identifiers: string[]
}

export interface PPPCPayload extends Payload {
    services: {
        accessibility: PPPCService[]
        address_book: PPPCService[]
        apple_events: PPPCService[]
        calendar: PPPCService[]
        camera: PPPCService[]
        microphone: PPPCService[]
        photos: PPPCService[]
        post_event: PPPCService[]
        reminders: PPPCService[]
        system_policy_all_files: PPPCService[]
        system_policy_sys_admin_files: PPPCService[]
        file_provider_presence: PPPCService[]
        listen_event: PPPCService[]
        media_library: PPPCService[]
        screen_capture: PPPCService[]
        speech_recognition: PPPCService[]
        system_policy_desktop_folder: PPPCService[]
        system_policy_documents_folder: PPPCService[]
        system_policy_downloads_folder: PPPCService[]
        system_policy_network_volumes: PPPCService[]
        system_policy_removable_volumes: PPPCService[]
    }
}

export interface PPPCService {
    allowed: boolean
    authorization?: 'AllowStandardUserToSetSystemService' | 'Deny'
    code_requirement: string
    comment: string
    identifier_type: 'bundleID' | 'path'
    identifier: string
    static_code: boolean
    predefined_app: any
    manual_selection: boolean
    rowId: string
}

export interface PPPCInput {
    identifier: string
    codeRequirement: string
    services: Array<PPPCServiceInput | PPPCScreenCaptureServiceInput>
}

export interface PPPCServiceInput {
    service:
        | 'accessibility'
        | 'address_book'
        | 'apple_events'
        | 'calendar'
        | 'camera'
        | 'microphone'
        | 'photos'
        | 'post_event'
        | 'reminders'
        | 'system_policy_all_files'
        | 'system_policy_sys_admin_files'
        | 'file_provider_presence'
        | 'listen_event'
        | 'media_library'
        | 'speech_recognition'
        | 'system_policy_desktop_folder'
        | 'system_policy_documents_folder'
        | 'system_policy_downloads_folder'
        | 'system_policy_network_volumes'
        | 'system_policy_removable_volumes'
    allowed: boolean
    static_code?: Boolean
    identifier_type: 'bundleID' | 'path'
}

export interface PPPCScreenCaptureServiceInput {
    service: 'screen_capture'
    authorization: 'AllowStandardUserToSetSystemService' | 'Deny'
    static_code?: Boolean
    identifier_type: 'bundleID' | 'path'
}

export interface Extension {
    teamIdentifier: string
    bundleIdentifiers: string[]
}
