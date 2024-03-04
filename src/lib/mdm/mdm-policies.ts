import axios from 'axios'
import { Urls } from '../addigy.constants'
import { v4 as uuidv4 } from 'uuid'
import { IAddigyInternalAuthObject } from '../auth/auth.types'
import {
    CreateWebContentFilterPayload,
    Extension,
    KernelExtensionPayload,
    NotificationSettings,
    NotificationSettingsPayload,
    PPPCInput,
    PPPCPayload,
    PPPCService,
    ServiceManagementPayload,
    ServiceManagementPayloadRule,
    SystemExtensionPayload,
    WebContentFilterPayload,
} from './mdm.types'
import { FilevaultPayload, FilevaultRequest } from '../files/files.types'
import { getAxiosHttpAgents } from '../addigy.utils'

export class MdmPolicies {
    private readonly http = axios.create({
        baseURL: `${Urls.appProd}/api/mdm/user/profiles/configurations`,
        ...getAxiosHttpAgents(),
        headers: { origin: Urls.appProd },
    })

    /**
     * @param authObject
     * @param name
     * Name of the Policy
     * @param allowOverrides
     * Users can approve additional kernel extensions not explicitly allowed by configuration profiles.
     * @param kernelExtensions
     * An Object to pass through Team Identifiers and Kernel Extensions
     * allowedTeamIdentifiers: List of Team Identifiers that define which validly signed kernel extensions will be allowed to load
     * allowedKernelExtensions: Bundle identifier and team identifier of kernel extension that will be allowed. Use An empty team identifier for unsigned legacy kernel extensions
     */
    async createKernelExtensionPolicy(
        authObject: IAddigyInternalAuthObject,
        name: string,
        allowOverrides: boolean,
        kernelExtensions: {
            allowedTeamIdentifiers?: string[]
            allowedKernelExtensions?: Extension[]
        },
    ): Promise<any> {
        let payloadUUID = uuidv4()
        let groupUUID = uuidv4()

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

    /**
     *
     * @param authObject
     * @param name
     * Name of the Policy
     * @param allowOverrides
     * Users can approve additional kernel extensions not explicitly allowed by configuration profiles.
     * @param systemExtensions
     * An Object to pass through Allowed System Extensions, Allowed System Extension Types and Allowed Team Identifiers
     * allowedSystemExtensions: A dictionary of system extensions that will always be approved on the machine. The dictionary maps the team identifiers (keys) to arrays of bundle identifiers, where the bundle identifier defines the system extension to be installed.
     * allowedSystemExtensionTypes: A dictionary mapping a team identifier to an array of strings, where each string is a type of system extension that may be installed for that team identifier
     * allowedTeamIdentifiers: An array, of team identifiers, that defines valid, signed system extensions which are allowed to load. All system extensions signed with any of the specified team identifiers will be considered to be approved.
     */
    async createSystemExtensionPolicy(
        authObject: IAddigyInternalAuthObject,
        name: string,
        allowOverrides: boolean,
        systemExtensions: {
            allowedSystemExtensions?: Extension[]
            allowedSystemExtensionTypes?: Extension[]
            allowedTeamIdentifiers?: string[]
        },
    ): Promise<any> {
        const groupUUID = uuidv4()

        const payload: SystemExtensionPayload = {
            addigy_payload_type:
                'com.addigy.syspolicy.system-extension-policy.com.apple.system-extension-policy',
            payload_type: 'com.apple.system-extension-policy',
            payload_version: 1,
            payload_identifier: `com.addigy.syspolicy.system-extension-policy.com.apple.system-extension-policy.${groupUUID}`,
            payload_uuid: uuidv4(),
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

    async createNotificationSettingsPolicy(
        authObject: IAddigyInternalAuthObject,
        name: string,
        notificationSettings: NotificationSettings[],
    ): Promise<any> {
        const groupUUID = uuidv4()

        const payload: NotificationSettingsPayload = {
            addigy_payload_type: 'com.addigy.notifications.com.apple.notificationsettings',
            payload_type: 'com.apple.notificationsettings',
            payload_version: 1,
            payload_identifier: `com.addigy.notifications.com.apple.notificationsettings.${groupUUID}`,
            payload_uuid: uuidv4(),
            payload_group_id: groupUUID,
            payload_display_name: name,
            notification_settings: notificationSettings,
        }

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
    }

    async createServiceManagementPolicy(
        authObject: IAddigyInternalAuthObject,
        name: string,
        rules: ServiceManagementPayloadRule[],
        priority = 9,
    ): Promise<any> {
        const groupUUID = uuidv4()

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
            payload_uuid: uuidv4(),
            payload_version: 1,
            policy_restricted: false,
            requires_device_supervision: false,
            requires_mdm_profile_approved: false,
            supported_os_versions: null,
            rules,
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

    /**
     @param authObject
     @param {string} payloadName - Name of the profile
     @param webContentPayload
     @param priority
     */
    async createWebContentFilterPolicy(
        authObject: IAddigyInternalAuthObject,
        payloadName: string,
        webContentPayload: CreateWebContentFilterPayload,
        priority = 9,
    ) {
        const groupUUID = uuidv4()
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
            payload_display_name: payloadName,
            payload_enabled: true,
            payload_group_id: groupUUID,
            payload_identifier: `com.addigy.webcontent-filter.com.apple.webcontent-filter.${groupUUID}`,
            payload_priority: priority,
            payload_type: 'com.apple.webcontent-filter',
            payload_uuid: uuidv4(),
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
    }

    async createFilevaultPolicy(
        authObject: IAddigyInternalAuthObject,
        name: string,
        filevault: FilevaultRequest,
        payloadPriority: number = 1,
    ) {
        const groupUUID = uuidv4()
        const encryptCertPayloadUUID = uuidv4()

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
                payload_uuid: uuidv4(),
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
                payload_uuid: uuidv4(),
                destroy_fv_key_on_standby:
                    filevault.destroyFvKeyOnStandby === undefined
                        ? null
                        : filevault.destroyFvKeyOnStandby,
                dont_allow_fde_disable: true,
            },
        ]

        if (filevault.escrowRecoveryKey)
            payloads.push(
                {
                    ...basePayload,
                    addigy_payload_type: 'com.addigy.securityAndPrivacy.com.apple.security.pkcs1',
                    payload_type: 'com.apple.security.pkcs1',
                    payload_identifier: `com.addigy.securityAndPrivacy.com.apple.security.pkcs1.${groupUUID}`,
                    payload_uuid: uuidv4(),
                    is_from_security_profile: true,
                },
                {
                    ...basePayload,
                    addigy_payload_type:
                        'com.addigy.securityAndPrivacy.com.apple.security.FDERecoveryKeyEscrow',
                    payload_type: 'com.apple.security.FDERecoveryKeyEscrow',
                    payload_identifier: `com.addigy.securityAndPrivacy.com.apple.security.FDERecoveryKeyEscrow.${groupUUID}`,
                    payload_uuid: uuidv4(),
                    encrypt_cert_payload_uuid: encryptCertPayloadUUID,
                    location: 'Key will be escrowed to an Addigy secure database.',
                },
                {
                    ...basePayload,
                    addigy_payload_type:
                        'com.addigy.securityAndPrivacy.com.apple.security.FDERecoveryRedirect',
                    payload_type: 'com.apple.security.FDERecoveryRedirect',
                    payload_identifier: `com.addigy.securityAndPrivacy.com.apple.security.FDERecoveryRedirect.${groupUUID}`,
                    payload_uuid: uuidv4(),
                    encrypt_cert_payload_uuid: encryptCertPayloadUUID,
                    redirect_url: '',
                },
            )

        try {
            let res = await this.http.post(
                '/',
                { payloads },
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

    /**
     *
     * @param authObject
     * @param name
     * name of the Policy
     * @param pppcPolicy
     * Enter the identifier, code_requirement and an array of service items the identifier and code requirement will be assigned to
     * example: {identifier: 'ex_identifier', codeRequirement: 'ex_coderequirement', services: [{service: 'address_book', identifier_type: "bundleID", allowed: true}, {service: "screen_capture", identifier_type: "bundleID", authorization: "AllowStandardUserToSetSystemService"}] }
     */
    async createPPPCPolicy(
        authObject: IAddigyInternalAuthObject,
        name: string,
        pppcPolicy: PPPCInput[],
    ): Promise<any> {
        const groupUUID = uuidv4()
        const payload: PPPCPayload = {
            addigy_payload_type:
                'com.addigy.TCC.configuration-profile-policy.com.apple.TCC.configuration-profile-policy',
            payload_type: 'com.apple.TCC.configuration-profile-policy',
            payload_display_name: name,
            payload_group_id: groupUUID,
            payload_version: 1,
            payload_identifier: `com.addigy.TCC.configuration-profile-policy.com.apple.TCC.configuration-profile-policy.${groupUUID}`,
            payload_uuid: uuidv4(),
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
                    rowId: uuidv4(),
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

        const res = await this.http.post(
            '/',
            { payloads: [payload] },
            {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                },
            },
        )
        return res.data
    }
}
