import { AxiosInstance } from 'axios'
import { randomUUID } from 'crypto'
import {
    AssignMdmPoliciesRequest,
    CreateCustomProfileOptions,
    MdmConfigurationPayloads,
    MdmPayloadManifest,
    MdmPayloadRequest,
    MdmPayloadResult,
    MdmPayloadsQueryRequest,
} from './v2.types'
import {
    CreateWebContentFilterPayload,
    Extension,
    KernelExtensionPayload,
    MdmConfigurationInput,
    MdmConfiguration,
    NotificationSettings,
    NotificationSettingsPayload,
    PPPCInput,
    PPPCPayload,
    PPPCService,
    ServiceManagementPayload,
    ServiceManagementPayloadRule,
    SystemExtensionPayload,
    WebContentFilterPayload,
} from '../mdm/mdm.types'
import { FilevaultPayload, FilevaultRequest } from '../files/files.types'

export class MdmConfigurationsV2 {
    constructor(private readonly http: AxiosInstance) {}

    // ---------------------------------------------------------------------------
    // Raw API endpoint methods
    // ---------------------------------------------------------------------------

    /**
     * Returns all MDM configuration profiles in the organization.
     *
     * @returns `MdmConfigurationPayloads` containing all profiles
     */
    async list(): Promise<MdmConfigurationPayloads> {
        const response = await this.http.get('/mdm/configurations/profiles')
        return response.data as MdmConfigurationPayloads
    }

    /**
     * Returns a single configuration profile by its group ID.
     *
     * @param payloadGroupId - The payload group ID of the configuration profile
     * @returns `MdmConfigurationPayloads` for the specified profile
     */
    async get(payloadGroupId: string): Promise<MdmConfigurationPayloads> {
        const response = await this.http.get(
            `/mdm/configurations/profile/${encodeURIComponent(payloadGroupId)}`,
        )
        return response.data as MdmConfigurationPayloads
    }

    /**
     * Deletes a configuration profile by its group ID.
     *
     * @param payloadGroupId - The payload group ID of the configuration profile to delete
     * @returns Confirmation string from the API
     */
    async delete(payloadGroupId: string): Promise<string> {
        const response = await this.http.delete(
            `/mdm/configurations/profile/${encodeURIComponent(payloadGroupId)}`,
        )
        return response.data as string
    }

    /**
     * Creates a new configuration profile from an array of raw payload objects.
     *
     * @param payloads - Array of `MdmPayloadRequest` objects describing the profile payloads
     * @returns The created `MdmConfigurationPayloads`
     */
    async create(payloads: MdmPayloadRequest[]): Promise<MdmConfigurationPayloads> {
        const response = await this.http.post('/mdm/configurations/profile', { payloads })
        return response.data as MdmConfigurationPayloads
    }

    /**
     * Uploads a raw `.mobileconfig` file as a custom MDM configuration profile.
     *
     * @param profile - The `.mobileconfig` file content as a `Buffer` or `string`
     * @param options - Optional minimum OS version constraints (`macos_minimum_version`, `ios_minimum_version`, `tvos_minimum_version`)
     * @returns The created `MdmConfigurationPayloads`
     */
    async createCustomProfile(
        profile: Buffer | string,
        options?: CreateCustomProfileOptions,
    ): Promise<MdmConfigurationPayloads> {
        const form = new FormData()
        const blob = new Blob([profile], { type: 'application/x-apple-aspen-config' })
        form.append('profile', blob, 'profile.mobileconfig')
        if (options?.ios_minimum_version)
            form.append('ios_minimum_version', options.ios_minimum_version)
        if (options?.macos_minimum_version)
            form.append('macos_minimum_version', options.macos_minimum_version)
        if (options?.tvos_minimum_version)
            form.append('tvos_minimum_version', options.tvos_minimum_version)

        const response = await this.http.post('/mdm/configurations/custom-profile', form, {
            headers: { 'content-type': undefined },
        })
        return response.data as MdmConfigurationPayloads
    }

    /**
     * Updates existing payloads within a configuration profile.
     *
     * @param payloads - Array of `MdmPayloadResult` objects with updated values
     * @returns The updated `MdmConfigurationPayloads`
     */
    async updatePayloads(payloads: MdmPayloadResult[]): Promise<MdmConfigurationPayloads> {
        const response = await this.http.put('/mdm/configurations/profiles/payloads', { payloads })
        return response.data as MdmConfigurationPayloads
    }

    /**
     * Assigns a configuration profile to one or more policies.
     *
     * @param groupId - The payload group ID of the configuration profile
     * @param policyIds - Array of policy IDs to assign the profile to
     * @returns Confirmation string from the API
     */
    async assignPolicies(groupId: string, policyIds: string[]): Promise<string> {
        const body: AssignMdmPoliciesRequest = { groupId, policyIds }
        const response = await this.http.post('/mdm/configurations/profile/policies', body)
        return response.data as string
    }

    /**
     * Removes a configuration profile from one or more policies.
     *
     * @param groupId - The payload group ID of the configuration profile
     * @param policyIds - Array of policy IDs to remove the profile from
     * @returns Confirmation string from the API
     */
    async unassignPolicies(groupId: string, policyIds: string[]): Promise<string> {
        const body: AssignMdmPoliciesRequest = { groupId, policyIds }
        const response = await this.http.delete('/mdm/configurations/profile/policies', {
            data: body,
        })
        return response.data as string
    }

    /**
     * Returns all available MDM payload type definitions (manifests).
     *
     * @returns Array of `MdmPayloadManifest` objects
     */
    async listDefinitions(): Promise<MdmPayloadManifest[]> {
        const response = await this.http.get('/mdm/configurations/definitions')
        return response.data as MdmPayloadManifest[]
    }

    /**
     * Returns the manifest for a specific payload type.
     *
     * @param addigyPayloadType - The Addigy payload type identifier (e.g. `com.addigy.wifi.com.apple.wifi.managed`)
     * @returns The `MdmPayloadManifest` for the specified type
     */
    async getDefinition(addigyPayloadType: string): Promise<MdmPayloadManifest> {
        const response = await this.http.get(
            `/mdm/configurations/definition/${encodeURIComponent(addigyPayloadType)}`,
        )
        return response.data as MdmPayloadManifest
    }

    /**
     * Returns all payload results for a given policy and payload type combination.
     *
     * @param policyId - The policy ID to query
     * @param payloadType - The Apple payload type (e.g. `com.apple.wifi.managed`)
     * @returns Array of `MdmPayloadResult` objects
     */
    async listByPolicyAndType(policyId: string, payloadType: string): Promise<MdmPayloadResult[]> {
        const response = await this.http.get('/mdm/configurations/policy/profiles', {
            params: { policy_id: policyId, payload_type: payloadType },
        })
        return response.data as MdmPayloadResult[]
    }

    /**
     * Queries payloads for a specific organization, optionally filtering by payload group IDs.
     *
     * @param organizationId - The organization ID
     * @param request - Optional query body to filter by `payload_group_ids` or `excluded_payload_group_ids`
     * @returns `MdmConfigurationPayloads` matching the query
     */
    async queryPayloads(
        organizationId: string,
        request?: MdmPayloadsQueryRequest,
    ): Promise<MdmConfigurationPayloads> {
        const response = await this.http.post(
            `/o/${encodeURIComponent(organizationId)}/mdm/payloads/query`,
            request ?? {},
        )
        return response.data as MdmConfigurationPayloads
    }

    // ---------------------------------------------------------------------------
    // Helper methods (ported from MdmPolicies / MdmProfiles)
    // ---------------------------------------------------------------------------

    /**
     * Creates a Kernel Extension Policy (`com.apple.syspolicy.kernel-extension-policy`) profile.
     *
     * @param name - Display name for the configuration profile
     * @param allowOverrides - Whether to allow users to approve kernel extensions
     * @param kernelExtensions - Allowed team identifiers and kernel extension bundle identifiers
     * @returns The created `MdmConfigurationPayloads`
     */
    async createKernelExtensionPolicy(
        name: string,
        allowOverrides: boolean,
        kernelExtensions: {
            allowedTeamIdentifiers?: string[]
            allowedKernelExtensions?: Extension[]
        },
    ): Promise<MdmConfigurationPayloads> {
        const payloadUUID = randomUUID()
        const groupUUID = randomUUID()

        const payload: KernelExtensionPayload = {
            addigy_payload_type:
                'com.addigy.syspolicy.kernel-extension-policy.com.apple.syspolicy.kernel-extension-policy',
            payload_type: 'com.apple.syspolicy.kernel-extension-policy',
            payload_version: 1,
            payload_identifier: `com.addigy.syspolicy.kernel-extension-policy.com.apple.syspolicy.kernel-extension-policy.${groupUUID}`,
            payload_uuid: payloadUUID,
            payload_group_id: groupUUID,
            payload_enabled: true,
            payload_display_name: name,
            allow_user_overrides: allowOverrides,
            allowed_kernel_extensions: {},
            allowed_team_identifiers: [],
        }

        if (kernelExtensions.allowedKernelExtensions?.length) {
            kernelExtensions.allowedKernelExtensions.forEach((e) => {
                payload.allowed_kernel_extensions[e.teamIdentifier] = e.bundleIdentifiers
            })
        }
        if (kernelExtensions.allowedTeamIdentifiers?.length) {
            kernelExtensions.allowedTeamIdentifiers.forEach((e) => {
                payload.allowed_team_identifiers.push(e)
            })
        }

        return this.create([payload as unknown as MdmPayloadRequest])
    }

    /**
     * Creates a System Extension Policy (`com.apple.system-extension-policy`) profile.
     *
     * @param name - Display name for the configuration profile
     * @param allowOverrides - Whether to allow users to approve system extensions
     * @param systemExtensions - Allowed system extensions, extension types, and team identifiers
     * @returns The created `MdmConfigurationPayloads`
     */
    async createSystemExtensionPolicy(
        name: string,
        allowOverrides: boolean,
        systemExtensions: {
            allowedSystemExtensions?: Extension[]
            allowedSystemExtensionTypes?: Extension[]
            allowedTeamIdentifiers?: string[]
        },
    ): Promise<MdmConfigurationPayloads> {
        const groupUUID = randomUUID()

        const payload: SystemExtensionPayload = {
            addigy_payload_type:
                'com.addigy.syspolicy.system-extension-policy.com.apple.system-extension-policy',
            payload_type: 'com.apple.system-extension-policy',
            payload_version: 1,
            payload_identifier: `com.addigy.syspolicy.system-extension-policy.com.apple.system-extension-policy.${groupUUID}`,
            payload_uuid: randomUUID(),
            payload_group_id: groupUUID,
            payload_enabled: true,
            payload_display_name: name,
            allowed_system_extensions: {},
            allowed_system_extensions_types: {},
            allowed_team_identifiers: [],
            allow_user_overrides: allowOverrides,
        }

        if (systemExtensions.allowedSystemExtensions?.length) {
            systemExtensions.allowedSystemExtensions.forEach((e) => {
                payload.allowed_system_extensions[e.teamIdentifier] = e.bundleIdentifiers
            })
        }
        if (systemExtensions.allowedSystemExtensionTypes?.length) {
            systemExtensions.allowedSystemExtensionTypes.forEach((e) => {
                payload.allowed_system_extensions_types[e.teamIdentifier] = e.bundleIdentifiers
            })
        }
        if (systemExtensions.allowedTeamIdentifiers?.length) {
            systemExtensions.allowedTeamIdentifiers.forEach((e) => {
                payload.allowed_team_identifiers.push(e)
            })
        }

        return this.create([payload as unknown as MdmPayloadRequest])
    }

    /**
     * Creates a Notification Settings (`com.apple.notificationsettings`) profile.
     *
     * @param name - Display name for the configuration profile
     * @param notificationSettings - Array of per-app notification setting objects
     * @returns The created `MdmConfigurationPayloads`
     */
    async createNotificationSettingsPolicy(
        name: string,
        notificationSettings: NotificationSettings[],
    ): Promise<MdmConfigurationPayloads> {
        const groupUUID = randomUUID()

        const payload: NotificationSettingsPayload = {
            addigy_payload_type: 'com.addigy.notifications.com.apple.notificationsettings',
            payload_type: 'com.apple.notificationsettings',
            payload_version: 1,
            payload_identifier: `com.addigy.notifications.com.apple.notificationsettings.${groupUUID}`,
            payload_uuid: randomUUID(),
            payload_group_id: groupUUID,
            payload_display_name: name,
            notification_settings: notificationSettings,
        }

        return this.create([payload as unknown as MdmPayloadRequest])
    }

    /**
     * Creates a Service Management (`com.apple.servicemanagement`) profile.
     *
     * @param name - Display name for the configuration profile
     * @param rules - Array of service management rules (label or bundle ID based)
     * @param priority - Payload priority (defaults to `9`)
     * @returns The created `MdmConfigurationPayloads`
     */
    async createServiceManagementPolicy(
        name: string,
        rules: ServiceManagementPayloadRule[],
        priority = 9,
    ): Promise<MdmConfigurationPayloads> {
        const groupUUID = randomUUID()

        const payload: ServiceManagementPayload = {
            addigy_payload_type: 'com.addigy.servicemanagement.com.apple.servicemanagement',
            addigy_payload_version: 0,
            has_manifest: false,
            payload_display_name: name,
            payload_enabled: false,
            payload_group_id: groupUUID,
            payload_identifier: `com.addigy.servicemanagement.com.apple.servicemanagement.${groupUUID}`,
            payload_priority: priority,
            payload_type: 'com.apple.servicemanagement',
            payload_uuid: randomUUID(),
            payload_version: 1,
            policy_restricted: false,
            requires_device_supervision: false,
            requires_mdm_profile_approved: false,
            supported_os_versions: null,
            rules,
        }

        return this.create([payload as unknown as MdmPayloadRequest])
    }

    /**
     * Creates a Web Content Filter (`com.apple.webcontent-filter`) profile.
     *
     * @param name - Display name for the configuration profile
     * @param webContentPayload - Web content filter configuration (provider bundle ID, designated requirement, etc.)
     * @param priority - Payload priority (defaults to `9`)
     * @returns The created `MdmConfigurationPayloads`
     */
    async createWebContentFilterPolicy(
        name: string,
        webContentPayload: CreateWebContentFilterPayload,
        priority = 9,
    ): Promise<MdmConfigurationPayloads> {
        const groupUUID = randomUUID()

        const payload: WebContentFilterPayload = {
            addigy_payload_type: 'com.addigy.webcontent-filter.com.apple.webcontent-filter',
            addigy_payload_version: 2,
            auto_filter_enabled: null,
            blacklisted_urls: null,
            content_filter_uuid: null,
            filter_browsers: null,
            filter_data_provider_bundle_identifier: null,
            filter_data_provider_designated_requirement: null,
            filter_packet_provider_bundle_identifier: null,
            filter_packet_provider_designated_requirement: null,
            filter_packets: null,
            filter_sockets: true,
            filter_type: 'Plugin',
            has_manifest: false,
            organization: null,
            password: null,
            payload_display_name: name,
            payload_enabled: true,
            payload_group_id: groupUUID,
            payload_identifier: `com.addigy.webcontent-filter.com.apple.webcontent-filter.${groupUUID}`,
            payload_priority: priority,
            payload_type: 'com.apple.webcontent-filter',
            payload_uuid: randomUUID(),
            payload_version: 1,
            permitted_urls: null,
            policy_restricted: false,
            requires_device_supervision: false,
            requires_mdm_profile_approved: false,
            server_address: null,
            supported_os_versions: null,
            user_name: null,
            vendor_config: null,
            white_listed_bookmarks: null,
            ...webContentPayload,
        }

        return this.create([payload as unknown as MdmPayloadRequest])
    }

    /**
     * Creates a FileVault (`com.apple.MCX.FileVault2`) profile.
     * When `escrowRecoveryKey` is `true`, additional escrow payloads are included automatically.
     *
     * @param name - Display name for the configuration profile
     * @param filevault - FileVault configuration options (enable, defer, escrow, etc.)
     * @param payloadPriority - Payload priority (defaults to `1`)
     * @returns The created `MdmConfigurationPayloads`
     */
    async createFilevaultPolicy(
        name: string,
        filevault: FilevaultRequest,
        payloadPriority = 1,
    ): Promise<MdmConfigurationPayloads> {
        const groupUUID = randomUUID()
        const encryptCertPayloadUUID = randomUUID()

        const basePayload = {
            payload_display_name: name,
            payload_version: 1,
            payload_group_id: groupUUID,
            addigy_payload_version: 0,
            payload_priority: payloadPriority,
        }

        const payloads: FilevaultPayload[] = [
            {
                ...basePayload,
                payload_type: 'com.apple.MCX.FileVault2',
                addigy_payload_type: 'com.addigy.securityAndPrivacy.com.apple.MCX.FileVault2',
                payload_identifier: `com.addigy.securityAndPrivacy.com.apple.MCX.FileVault2.${groupUUID}`,
                payload_uuid: randomUUID(),
                enable: filevault.enable ? 'On' : 'Off',
                defer: filevault.defer,
                use_recovery_key: true,
                show_recovery_key:
                    filevault.showRecoveryKey === undefined ? null : filevault.showRecoveryKey,
                defer_dont_ask_at_user_logout:
                    filevault.deferDontAskAtUserLogout === undefined
                        ? null
                        : filevault.deferDontAskAtUserLogout,
                defer_force_at_user_login_max_bypass_attempts:
                    filevault.deferForceAtUserLoginMaxBypassAttempts === undefined
                        ? null
                        : filevault.deferForceAtUserLoginMaxBypassAttempts,
            },
            {
                ...basePayload,
                payload_type: 'com.apple.MCX',
                addigy_payload_type: 'com.addigy.securityAndPrivacy.com.apple.MCX',
                payload_identifier: `com.addigy.securityAndPrivacy.com.apple.MCX.${groupUUID} `,
                payload_uuid: randomUUID(),
                destroy_fv_key_on_standby:
                    filevault.destroyFvKeyOnStandby === undefined
                        ? null
                        : filevault.destroyFvKeyOnStandby,
                dont_allow_fde_disable: true,
            },
        ]

        if (filevault.escrowRecoveryKey) {
            payloads.push(
                {
                    ...basePayload,
                    addigy_payload_type: 'com.addigy.securityAndPrivacy.com.apple.security.pkcs1',
                    payload_type: 'com.apple.security.pkcs1',
                    payload_identifier: `com.addigy.securityAndPrivacy.com.apple.security.pkcs1.${groupUUID}`,
                    payload_uuid: randomUUID(),
                    is_from_security_profile: true,
                },
                {
                    ...basePayload,
                    addigy_payload_type:
                        'com.addigy.securityAndPrivacy.com.apple.security.FDERecoveryKeyEscrow',
                    payload_type: 'com.apple.security.FDERecoveryKeyEscrow',
                    payload_identifier: `com.addigy.securityAndPrivacy.com.apple.security.FDERecoveryKeyEscrow.${groupUUID}`,
                    payload_uuid: randomUUID(),
                    encrypt_cert_payload_uuid: encryptCertPayloadUUID,
                    location: 'Key will be escrowed to an Addigy secure database.',
                },
                {
                    ...basePayload,
                    addigy_payload_type:
                        'com.addigy.securityAndPrivacy.com.apple.security.FDERecoveryRedirect',
                    payload_type: 'com.apple.security.FDERecoveryRedirect',
                    payload_identifier: `com.addigy.securityAndPrivacy.com.apple.security.FDERecoveryRedirect.${groupUUID}`,
                    payload_uuid: randomUUID(),
                    encrypt_cert_payload_uuid: encryptCertPayloadUUID,
                    redirect_url: '',
                },
            )
        }

        return this.create(payloads as unknown as MdmPayloadRequest[])
    }

    /**
     * Creates a Privacy Preferences Policy Control (PPPC / TCC) profile
     * (`com.apple.TCC.configuration-profile-policy`).
     *
     * @param name - Display name for the configuration profile
     * @param pppcPolicy - Array of PPPC entries, each defining an app identifier, code requirement, and service permissions
     * @returns The created `MdmConfigurationPayloads`
     */
    async createPPPCPolicy(
        name: string,
        pppcPolicy: PPPCInput[],
    ): Promise<MdmConfigurationPayloads> {
        const groupUUID = randomUUID()

        const payload: PPPCPayload = {
            addigy_payload_type:
                'com.addigy.TCC.configuration-profile-policy.com.apple.TCC.configuration-profile-policy',
            payload_type: 'com.apple.TCC.configuration-profile-policy',
            payload_display_name: name,
            payload_group_id: randomUUID(),
            payload_version: 1,
            payload_identifier: `com.addigy.TCC.configuration-profile-policy.com.apple.TCC.configuration-profile-policy.${groupUUID}`,
            payload_uuid: randomUUID(),
            services: {
                accessibility: [],
                address_book: [],
                apple_events: [],
                calendar: [],
                camera: [],
                microphone: [],
                photos: [],
                post_event: [],
                reminders: [],
                system_policy_all_files: [],
                system_policy_sys_admin_files: [],
                file_provider_presence: [],
                listen_event: [],
                media_library: [],
                screen_capture: [],
                speech_recognition: [],
                system_policy_desktop_folder: [],
                system_policy_documents_folder: [],
                system_policy_downloads_folder: [],
                system_policy_network_volumes: [],
                system_policy_removable_volumes: [],
            },
        }

        pppcPolicy.forEach((pppc) => {
            pppc.services.forEach((e) => {
                const service: PPPCService = {
                    allowed: false,
                    authorization: '',
                    code_requirement: pppc.codeRequirement,
                    comment: '',
                    identifier_type: e.identifierType,
                    identifier: pppc.identifier,
                    static_code: e.staticCode ?? false,
                    predefined_app: null,
                    manual_selection: true,
                    rowId: randomUUID(),
                }
                if (e.service === 'screen_capture' && e.authorization) {
                    service.authorization = e.authorization
                }
                if (e.service !== 'screen_capture') service.allowed = e.allowed

                if (e.service === 'apple_events') {
                    service.ae_receiver_identifier = e.aeReceiverIdentifier
                    service.ae_receiver_identifier_type = e.aeReceiverIdentifierType
                    service.ae_receiver_code_requirement = e.aeReceiverCodeRequirement
                    service.ae_receiver_predefined_app = null
                    service.ae_receiver_manual_selection = true
                }
                payload.services[e.service].push(service)
            })
        })

        return this.create([payload as unknown as MdmPayloadRequest])
    }

    /**
     * Creates a certificate payload (`com.apple.security.root`) profile, e.g. for deploying a root CA certificate.
     *
     * @param mdmConfigurationInput - Certificate configuration input (payload display name, cert data, etc.)
     * @returns The created `MdmConfigurationPayloads`
     */
    async createMdmCertificate(
        mdmConfigurationInput: MdmConfigurationInput,
    ): Promise<MdmConfigurationPayloads> {
        const groupUUID = randomUUID()

        const payload: MdmConfiguration = {
            addigy_payload_type: 'com.addigy.certificate.com.apple.security.root',
            payload_type: 'com.apple.security.root',
            payload_version: 1,
            payload_group_id: groupUUID,
            payload_identifier: `com.addigy.certificate.com.apple.security.root.${groupUUID}`,
            payload_uuid: randomUUID(),
            addigy_payload_version: 0,
            ...mdmConfigurationInput,
        }

        return this.create([payload as unknown as MdmPayloadRequest])
    }

    /**
     * Low-level helper — passes one or more raw `MdmPayloadRequest` objects directly to `create()`.
     *
     * @param mdmProfile - A single `MdmPayloadRequest` or an array of them
     * @returns The created `MdmConfigurationPayloads`
     */
    async createMdmProfile(
        mdmProfile: MdmPayloadRequest | MdmPayloadRequest[],
    ): Promise<MdmConfigurationPayloads> {
        const payloads = Array.isArray(mdmProfile) ? mdmProfile : [mdmProfile]
        return this.create(payloads)
    }
}
