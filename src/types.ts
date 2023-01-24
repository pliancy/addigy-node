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
        | 'com.addigy.notifications.com.apple.notificationsettings'
        | 'com.addigy.custom.mdm.payload'
        | 'com.addigy.securityAndPrivacy.com.apple.MCX.FileVault2'
        | 'com.addigy.securityAndPrivacy.com.apple.MCX'
        | 'com.addigy.securityAndPrivacy.com.apple.security.pkcs1'
        | 'com.addigy.securityAndPrivacy.com.apple.security.FDERecoveryKeyEscrow'
        | 'com.addigy.securityAndPrivacy.com.apple.security.FDERecoveryRedirect'
    payload_type:
        | 'com.apple.system-extension-policy'
        | 'com.apple.syspolicy.kernel-extension-policy'
        | 'com.apple.TCC.configuration-profile-policy'
        | 'com.apple.notificationsettings'
        | 'custom'
        | 'com.apple.MCX.FileVault2'
        | 'com.apple.MCX'
        | 'com.apple.security.pkcs1'
        | 'com.apple.security.FDERecoveryKeyEscrow'
        | 'com.apple.security.FDERecoveryRedirect'

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

export interface Extension {
    teamIdentifier: string
    bundleIdentifiers: string[]
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
export interface SupportedOsVersions {
    macOS?: string
    iOS?: string
    tvOS?: string
}

export interface FilevaultPayload extends Payload {
    enable?: 'On' | 'Off'
    defer?: boolean
    use_recovery_key?: boolean
    show_recovery_key?: boolean | null
    defer_dont_ask_at_user_logout?: boolean | null
    defer_force_at_user_login_max_bypass_attempts?: number | null
    addigy_payload_version?: number
    destroy_fv_key_on_standby?: boolean | null
    dont_allow_fde_disable?: boolean
    is_from_security_profile?: boolean
    encrypt_cert_payload_uuid?: string
    location?: string
    payload_priority?: number
    redirect_url?: string
}

export interface FilevaultRequest {
    enable?: boolean
    defer?: boolean
    showRecoveryKey?: boolean
    /**
     * Require user to unlock filevault after hibernation
     */
    destroyFvKeyOnStandby?: boolean
    /**
     * When enabled, the device will encrypt the personal recovery key with a certificate created by Addigy. The encrypted key will be stored in a secured database.
     */
    escrowRecoveryKey?: boolean
    deferDontAskAtUserLogout?: boolean
    deferForceAtUserLoginMaxBypassAttempts?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}

export interface CustomFact {
    organization_id: string
    name: string
    return_type: string
    identifier: string
    version: number
    os_architectures: CustomFactOSArchitectures
    notes: string
    provider: string
    source: string
}

export interface CustomFactOSArchitectures {
    linux_arm: CustomFactOSArchitecturesData
    darwin_amd64: CustomFactOSArchitecturesData
}

export interface CustomFactOSArchitecturesData {
    language: string
    is_supported: boolean
    shebang: string
    script: string
    md5_hash: string
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
