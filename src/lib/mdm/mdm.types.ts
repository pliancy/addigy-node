import { Payload, SupportedOsVersions } from '../types'

export interface CreateWebContentFilterPayload {
    user_defined_name: string
    plugin_bundle_id: string
    filter_grade: 'firewall' | 'inspector'
    vendor_config?: Record<string, string>
    content_filter_uuid?: string
    server_address?: string
    organization?: string
    user_name?: string
    password?: string
    filter_browsers?: boolean
    filter_sockets?: boolean
    filter_data_provider_bundle_identifier?: string
    filter_data_provider_designated_requirement?: string
    filter_packets?: boolean
    filter_packet_provider_bundle_identifier?: string
    filter_packet_provider_designated_requirement?: string
    auto_filter_enabled?: null
    permitted_urls?: string[]
    blacklisted_urls?: string[]
    white_listed_bookmarks?: string[]
    policy_restricted?: boolean
    requires_device_supervision?: boolean
    requires_mdm_profile_approved?: boolean
}

export interface Extension {
    teamIdentifier: string
    bundleIdentifiers: string[]
}

export interface SystemExtensionPayload extends Payload {
    payload_enabled: boolean
    allowed_system_extensions: any
    allowed_system_extensions_types: any
    allowed_team_identifiers: string[]
    allow_user_overrides: boolean
}

export interface KernelExtensionPayload extends Payload {
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
    authorization?: 'AllowStandardUserToSetSystemService' | 'Deny' | ''
    code_requirement: string
    comment: string
    identifier_type: 'bundleID' | 'path'
    identifier: string
    static_code: boolean
    predefined_app: any
    manual_selection: boolean
    rowId: string
    ae_receiver_identifier?: string
    ae_receiver_identifier_type?: string
    ae_receiver_code_requirement?: string
    ae_receiver_predefined_app?: null
    ae_receiver_manual_selection?: true
}

export interface PPPCInput {
    identifier: string
    codeRequirement: string
    services: Array<
        | PPPCServiceInput
        | PPPCScreenCaptureServiceInput
        | PPPCAppleEventServiceInput
        | PPPCRestrictedServiceInput
    >
}

export interface PPPCServiceInput {
    service:
        | 'accessibility'
        | 'address_book'
        | 'calendar'
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
    staticCode?: boolean
    identifierType: 'bundleID' | 'path'
}

export interface WebContentFilterPayload extends Payload {
    addigy_payload_version: number
    auto_filter_enabled: null | boolean
    blacklisted_urls: null | string[]
    content_filter_uuid: null | string
    filter_browsers: null | boolean
    filter_data_provider_bundle_identifier: string | null
    filter_data_provider_designated_requirement: string | null
    filter_grade: 'firewall' | 'inspector'
    filter_packet_provider_bundle_identifier: null | string
    filter_packet_provider_designated_requirement: null | string
    filter_packets: null | boolean
    filter_sockets: boolean
    filter_type: string
    has_manifest: boolean
    organization: null | string
    password: null | string
    payload_enabled: boolean
    payload_priority: number
    permitted_urls: null | string[]
    plugin_bundle_id: string | null
    policy_restricted: boolean
    requires_device_supervision: boolean
    requires_mdm_profile_approved: boolean
    server_address: null | string
    supported_os_versions: null | SupportedOsVersions
    user_defined_name: string
    user_name: null | string
    vendor_config: Record<string, string> | null
    white_listed_bookmarks: null | string[]
}

export interface ServiceManagementPayload extends Payload {
    addigy_payload_version: number
    has_manifest: boolean
    payload_enabled: boolean
    payload_priority: number
    policy_restricted: boolean
    requires_device_supervision: boolean
    requires_mdm_profile_approved: boolean
    rules: ServiceManagementPayloadRule[]
    supported_os_versions: SupportedOsVersions | null
}

export interface ServiceManagementPayloadRule {
    comment: string
    rule_type: string
    rule_value: string
}

export interface NotificationSettings {
    bundle_identifier: string
    notifications_enabled: boolean
    show_in_lock_screen: boolean
    show_in_notification_center: boolean
    sounds_enabled: boolean
    badges_enabled: boolean
    critical_alert_enabled: boolean
    preview_type?: any
    alert_type?: any
}

export interface NotificationSettingsPayload extends Payload {
    notification_settings: NotificationSettings[]
}

export interface PPPCScreenCaptureServiceInput {
    service: 'microphone' | 'camera'
    allowed: false
    staticCode?: boolean
    identifierType: 'bundleID' | 'path'
}
export interface PPPCRestrictedServiceInput {
    service: 'screen_capture'
    authorization: 'AllowStandardUserToSetSystemService' | 'Deny'
    staticCode?: boolean
    identifierType: 'bundleID' | 'path'
}
export interface PPPCAppleEventServiceInput {
    service: 'apple_events'
    allowed: boolean
    staticCode?: boolean
    identifierType: 'bundleID' | 'path'
    aeReceiverIdentifier: string
    aeReceiverIdentifierType: 'bundleID' | 'path'
    aeReceiverCodeRequirement: string
}

export interface MdmConfigurations {
    payloads: Payload[]
    staged_payloads: any[]
    policies_mdm_payloads: PoliciesMdmPayload[]
}

export interface MdmConfigurationPayload {
    addigy_payload_type: string
    addigy_payload_version?: number
    orgid: string
    payload_display_name: string
    payload_group_id: string
    payload_identifier: string
    payload_priority: number
    payload_type: string
    payload_uuid: string
    payload_version: number
    policy_restricted: boolean
    has_manifest?: boolean
}

export interface PoliciesMdmPayload {
    orgid: string
    configuration_id: string
    policy_id: string
}
