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
        | 'com.addigy.servicemanagement.com.apple.servicemanagement'
        | 'com.addigy.webcontent-filter.com.apple.webcontent-filter'
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
        | 'com.apple.servicemanagement'
        | 'com.apple.webcontent-filter'

    payload_version: number
    payload_identifier: string
    payload_uuid: string
    payload_group_id: string
    payload_display_name: string
}

export interface SupportedOsVersions {
    macOS?: string
    iOS?: string
    tvOS?: string
}
