import got from 'got'
import { v4 as uuidv4 } from 'uuid'
import {
    Extension,
    IAddigyConfig,
    IAddigyInternalAuthObject,
    KernalExtensionPayload,
    PPPCInput,
    PPPCPayload,
    PPPCService,
    SystemExtensionPayload,
} from './types'

export * from './types'

enum AlertStatus {
    Acknowledged = 'Acknowledged',
    Resolved = 'Resolved',
    Unattended = 'Unattended',
}

enum UserRoles {
    Owner = 'power',
    Admin = 'admin',
    User = 'user',
}

export class Addigy {
    config: IAddigyConfig
    domain: string
    reqHeaders: any

    constructor(_config: IAddigyConfig) {
        this.config = _config
        this.reqHeaders = {
            'content-type': 'application/json',
            accept: 'application/json',
            'client-id': this.config.clientId,
            'client-secret': this.config.clientSecret,
        }
        this.domain = 'https://prod.addigy.com/api'
    }

    //
    // Instructions
    //

    async getPolicyInstructions(
        policyId: string,
        provider: string = 'ansible-profile',
    ): Promise<object[]> {
        try {
            let res = await this._addigyRequest(
                `${this.domain}/policies/instructions?provider=${provider}&policy_id=${policyId}`,
                { headers: this.reqHeaders },
            )
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async createPolicyInstructions(policyId: string, instructionId: string): Promise<object[]> {
        try {
            let res = await this._addigyRequest(`${this.domain}/policies/instructions`, {
                headers: this.reqHeaders,
                method: 'POST',
                body: JSON.stringify({
                    instruction_id: instructionId,
                    policy_id: policyId,
                }),
            })
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async deletePolicyInstructions(
        policyId: string,
        instructionId: string,
        provider: string = 'ansible-profile',
    ): Promise<object[]> {
        try {
            let res = await this._addigyRequest(
                `${this.domain}/policies/instructions?policy_id=${policyId}&instruction_id=${instructionId}&provider=${provider}`,
                {
                    headers: this.reqHeaders,
                    method: 'DELETE',
                },
            )
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    //
    // Devices
    //

    async getOnlineDevices(): Promise<object[]> {
        try {
            let res = await this._addigyRequest(`${this.domain}/devices/online`, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async getDevices(): Promise<object[]> {
        try {
            let res = await this._addigyRequest(`${this.domain}/devices`, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async getPolicyDevices(policyId: string): Promise<object[]> {
        try {
            let res = await this._addigyRequest(
                `${this.domain}/policies/devices?policy_id=${policyId}`,
                { headers: this.reqHeaders },
            )
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async updateDevicePolicy(policyId: string, agentId: string): Promise<object[]> {
        let postBody: any = {
            policy_id: policyId,
            agent_id: agentId,
        }

        try {
            let res = await this._addigyRequest(`${this.domain}/policies/devices`, {
                headers: {
                    'client-id': this.config.clientId,
                    'client-secret': this.config.clientSecret,
                },
                method: 'POST',
                form: true,
                body: postBody,
            })
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    //
    // Alerts
    //

    async getAlerts(
        status: AlertStatus,
        page: number = 1,
        pageLength: number = 10,
    ): Promise<object[]> {
        let statusUri = ''
        if (status) {
            statusUri = `&status=${status}`
        }

        try {
            let res = await this._addigyRequest(
                `${this.domain}/alerts?page=${page}&per_page=${pageLength}` + statusUri,
                { headers: this.reqHeaders },
            )
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    //
    // Policies
    //

    async getPolicies(): Promise<object[]> {
        try {
            let res = await this._addigyRequest(`${this.domain}/policies`, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async getPolicyDetails(
        policyId: string,
        provider: string = 'ansible-profile',
    ): Promise<object[]> {
        try {
            let res = await this._addigyRequest(
                `${this.domain}/policies/details?provider=${provider}&policy_id=${policyId}`,
                { headers: this.reqHeaders },
            )
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async createPolicy(
        name: string,
        parentId?: string,
        icon?: string,
        color?: string,
    ): Promise<object[]> {
        let postBody: any = {
            name: name,
        }

        if (icon !== undefined) {
            postBody['icon'] = icon
        }

        if (color !== undefined) {
            postBody['color'] = color
        }

        if (parentId !== undefined) {
            postBody['parent_id'] = parentId
        }

        try {
            let res = await this._addigyRequest(`${this.domain}/policies`, {
                method: 'POST',
                form: true,
                body: postBody,
            })
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    //
    // Maintenance
    //

    async getMaintenance(page: number = 1, pageLenth: number = 10): Promise<object[]> {
        try {
            let res = await this._addigyRequest(
                `${this.domain}/maintenance?page=${page}&per_page=${pageLenth}`,
                { headers: this.reqHeaders },
            )
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    //
    // Applications
    //

    async getInstalledApplications(): Promise<object[]> {
        try {
            let res = await this._addigyRequest(`${this.domain}/applications`, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    //
    // Profiles
    //

    async getProfiles(instructionId?: string): Promise<object[]> {
        let instructionUri = ''
        if (instructionId !== undefined) {
            instructionUri = `?instruction_id=${instructionId}`
        }

        try {
            let res = await this._addigyRequest(`${this.domain}/profiles` + instructionUri, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.body)
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
            let res = await this._addigyRequest(`${this.domain}/profiles`, {
                headers: this.reqHeaders,
                method: 'POST',
                json: postBody,
            })
            return JSON.parse(res.body)
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
            let res = await this._addigyRequest(`${this.domain}/profiles`, {
                headers: this.reqHeaders,
                method: 'PUT',
                json: postBody,
            })
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async deleteProfile(instructionId: string): Promise<object[]> {
        let postBody: any = {
            instruction_id: instructionId,
        }

        try {
            let res = await this._addigyRequest(`${this.domain}/profiles`, {
                headers: this.reqHeaders,
                method: 'DELETE',
                json: postBody,
            })
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    //
    // Commands
    //

    async runCommand(agentIds: string[], command: string): Promise<object[]> {
        let postBody: any = {
            agent_ids: agentIds,
            command: command,
        }

        try {
            let res = await this._addigyRequest(`${this.domain}/devices/commands`, {
                headers: this.reqHeaders,
                method: 'POST',
                json: postBody,
            })
            return res.body
        } catch (err) {
            throw err
        }
    }

    async getCommandOutput(actionId: string, agentId: string): Promise<object[]> {
        try {
            let res = await this._addigyRequest(
                `${this.domain}/devices/output?action_id=${actionId}&agentid=${agentId}`,
                { headers: this.reqHeaders },
            )
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    //
    // Public Software
    //

    async getPublicSoftware(): Promise<object[]> {
        try {
            let res = await this._addigyRequest(`${this.domain}/catalog/public`, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    //
    // Custom Software
    //

    async getCustomSoftware(): Promise<object[]> {
        try {
            let res = await this._addigyRequest(`${this.domain}/custom-software`, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async getCustomSoftwareAllVersions(softwareId: string): Promise<object[]> {
        try {
            let res = await this._addigyRequest(
                `${this.domain}/custom-software?identifier=${softwareId}`,
                { headers: this.reqHeaders },
            )
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async getCustomSoftwareSpecificVersion(instructionId: string): Promise<object[]> {
        try {
            let res = await this._addigyRequest(
                `${this.domain}/custom-software?instructionid=${instructionId}`,
                { headers: this.reqHeaders },
            )
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async getFileUploadUrl(fileName: string, contentType?: string): Promise<string> {
        const headers = {
            'client-Id': this.config.clientId,
            'client-Secret': this.config.clientSecret,
            'file-name': fileName,
            'content-type': contentType ?? 'application/octet-stream',
        }

        try {
            let res = await this._addigyRequest(
                `https://file-manager-prod.addigy.com/api/upload/url`,
                {
                    headers: headers,
                },
            )
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async uploadFile(uploadUrl: string, file: object, contentType?: string): Promise<object[]> {
        const headers = {
            'content-type': contentType ?? 'application/octet-stream',
        }

        try {
            let res = await this._addigyRequest(`${uploadUrl}`, {
                headers: headers,
                body: file,
                method: 'PUT',
            })
            return res.body
        } catch (err) {
            throw err
        }
    }

    async createCustomSoftware(
        baseIdentifier: string,
        version: string,
        downloads: string[],
        installationScript: string,
        condition: string,
        removeScript: string,
    ): Promise<object[]> {
        let postBody: any = {
            base_identifier: baseIdentifier,
            version: version,
            downloads: downloads,
            installation_script: installationScript,
            condition: condition,
            remove_script: removeScript,
        }

        try {
            let res = await this._addigyRequest(`${this.domain}/custom-software`, {
                headers: this.reqHeaders,
                method: 'POST',
                json: postBody,
            })
            // Fun fact! This endpoint returns an empty string when successful. Yes, that is correct, an empty string...
            return res.body
        } catch (err) {
            throw err
        }
    }

    //
    // The following endpoints use Addigy's internal API. Use at your own risk.
    //

    async getUsers(authObject: IAddigyInternalAuthObject): Promise<object[]> {
        try {
            let res = await this._addigyRequest('https://app-prod.addigy.com/api/account', {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    origin: 'https://app-prod.addigy.com',
                },
                method: 'GET',
            })
            return JSON.parse(res.body).users
        } catch (err) {
            throw err
        }
    }

    async createUser(
        authObject: IAddigyInternalAuthObject,
        email: string,
        name: string,
        policies: string[] = [],
        role: UserRoles | string,
        phone?: string,
    ): Promise<object[]> {
        let postBody: any = {
            name: name,
            email: email,
            policies: policies,
            role: role,
        }

        if (phone !== undefined) {
            postBody['phone'] = phone
        }

        try {
            let res = await this._addigyRequest(
                'https://app-prod.addigy.com/api/cloud/users/user',
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                    method: 'POST',
                    json: postBody,
                },
            )
            return res.body
        } catch (err) {
            throw err
        }
    }

    async updateUser(
        authObject: IAddigyInternalAuthObject,
        email: string,
        name: string,
        policies: string[] = [],
        role: string,
        phone?: string,
    ): Promise<object[]> {
        let postBody: any = {
            id: '',
            uid: '', // this has to be blank on th PUT for some reason
            name: name,
            authanvil_tfa_username: '',
            email: email,
            phone: '',
            role: role,
            addigy_role: '', // this also has to be blank
            policies: policies,
        }

        if (phone !== undefined) {
            postBody['phone'] = phone
        }

        try {
            // find userId that corresponds to the provided email
            let users: Array<any> = await this.getUsers(authObject)
            let user: any = users.find((element) => element.email === email)
            if (!user) throw new Error(`No user with email ${email} exists.`)

            postBody['id'] = user.id // Addigy requires the user ID to be both in the post body and in the REST URI

            let res = await this._addigyRequest(
                `https://app-prod.addigy.com/api/cloud/users/user/${
                    user.id
                }?user_email=${encodeURIComponent(user.email)}`,
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                    method: 'PUT',
                    json: postBody,
                },
            )
            return res.body // returns `ok` if successful...
        } catch (err) {
            throw err
        }
    }

    async deleteUser(authObject: IAddigyInternalAuthObject, email: string): Promise<object[]> {
        try {
            // find userId that corresponds to the provided email
            let users: Array<any> = await this.getUsers(authObject)
            let user: any = users.find((element) => element.email === email)
            if (!user) throw new Error(`No user with email ${email} exists.`)

            let res = await this._addigyRequest(
                `https://app-prod.addigy.com/api/cloud/users/user/${
                    user.id
                }?user_email=${encodeURIComponent(email)}`,
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                    method: 'DELETE',
                },
            )

            return JSON.parse(res.body) // this will return "ok" if successful.
        } catch (err) {
            throw err
        }
    }

    async getBillingData(authObject: IAddigyInternalAuthObject): Promise<object[]> {
        try {
            let res = await this._addigyRequest(
                'https://app-prod.addigy.com/api/billing/get_chargeover_billing_data',
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                        email: authObject.emailAddress,
                        orgid: authObject.orgId,
                    },
                    method: 'GET',
                },
            )
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async getApiIntegrations(authObject: IAddigyInternalAuthObject): Promise<object[]> {
        try {
            let res = await this._addigyRequest('https://prod.addigy.com/accounts/api/keys/get/', {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    origin: 'https://app-prod.addigy.com',
                    email: authObject.emailAddress,
                    orgid: authObject.orgId,
                },
                method: 'GET',
            })
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async createApiIntegration(
        authObject: IAddigyInternalAuthObject,
        name: string,
    ): Promise<object> {
        let postBody: any = {
            name,
        }
        try {
            let res = await this._addigyRequest(
                'https://app-prod.addigy.com/api/integrations/keys',
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                    method: 'POST',
                    json: postBody,
                },
            )
            return res.body
        } catch (err) {
            throw err
        }
    }

    async deleteApiIntegration(
        authObject: IAddigyInternalAuthObject,
        objectId: string,
    ): Promise<object> {
        try {
            let res = await this._addigyRequest(
                `https://app-prod.addigy.com/api/integrations/keys?id=${objectId}`,
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                    method: 'DELETE',
                },
            )
            return res.body
        } catch (err) {
            throw err
        }
    }

    async getScreenconnectLinks(
        authObject: IAddigyInternalAuthObject,
        sessionId: string,
        agentId?: string,
    ): Promise<object[]> {
        // in most (all?) cases tested, the agentId and sessionId are identical, but they are independently passed in the API call
        agentId = agentId ? agentId : sessionId

        let postBody = {
            sessionId: sessionId,
            agentid: agentId,
        }

        try {
            let res = await this._addigyRequest(
                'https://app-prod.addigy.com/api/devices/screenconnect/links',
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                        email: authObject.emailAddress,
                        orgid: authObject.orgId,
                    },
                    method: 'POST',
                    json: postBody,
                },
            )
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    /**
     *
     * @param name
     * Name of the Policy
     * @param allowOverrides
     * Users can approve additional kernel extensions not explicitly allowed by configuration profiles.
     * @param kernalExtensions
     * An Object to pass through Team Identifiers and Kernal Extensions
     * allowedTeamIdentifiers: List of Team Identifiers that define which validly signed kernel extensions will be allowed to load
     * allowedKernalExtensions: Bundle identifer and team identifer of kernel extension that will be allowed. Use An empty team identifier for unsigned legacy kernel extensions
     */

    async createKernelExtensionPolicy(
        authObject: IAddigyInternalAuthObject,
        name: string,
        allowOverrides: boolean,
        kernalExtensions: {
            allowedTeamIdentifiers?: string[]
            allowedKernalExtensions?: Extension[]
        },
    ): Promise<any> {
        let payloadUUID = uuidv4()
        let groupUUID = uuidv4()

        const payload: KernalExtensionPayload = {
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
        if (kernalExtensions.allowedKernalExtensions?.length) {
            kernalExtensions.allowedKernalExtensions.forEach((e) => {
                payload.allowed_kernel_extensions[e.teamIdentifier] = e.bundleIdentifiers
            })
        }
        if (kernalExtensions.allowedTeamIdentifiers?.length) {
            kernalExtensions.allowedTeamIdentifiers.forEach((e) => {
                payload.allowed_team_identifiers.push(e)
            })
        }

        try {
            let res = await this._addigyRequest(
                'https://app-prod.addigy.com/api/mdm/user/profiles/configurations',
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                    method: 'POST',
                    json: { payloads: [payload] },
                },
            )
            return res.body
        } catch (err) {
            throw err
        }
    }

    /**
     *
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
    ): Promise<object> {
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
            let res = await this._addigyRequest(
                'https://app-prod.addigy.com/api/mdm/user/profiles/configurations',
                {
                    headers: {
                        Cookie: `auth_token=${authObject.authToken};`,
                        origin: 'https://app-prod.addigy.com',
                    },
                    method: 'POST',
                    json: { payloads: [payload] },
                },
            )
            return res.body
        } catch (err) {
            throw err
        }
    }

    /**
     *
     * @param name
     * name of the Policy
     * @param pppcPolicy
     * Enter in the identifier, code_requirement and an array of service items the identifier and code requirement will be assigned to
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

        const res = await this._addigyRequest(
            'https://app-prod.addigy.com/api/mdm/user/profiles/configurations',
            {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    origin: 'https://app-prod.addigy.com',
                },
                method: 'POST',
                json: { payloads: [payload] },
            },
        )
        return res.body
    }

    async getMdmConfigurations(authObject: IAddigyInternalAuthObject): Promise<any[]> {
        try {
            let res = await this._addigyRequest('https://app-prod.addigy.com/api/mdm/profiles', {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    origin: 'https://app-prod.addigy.com',
                },
                method: 'GET',
            })
            return JSON.parse(res.body)?.mdm_payloads
        } catch (err) {
            throw err
        }
    }

    async getMdmConfigurationByName(
        authObject: IAddigyInternalAuthObject,
        name: string,
    ): Promise<any> {
        try {
            const mdmConfigurations = await this.getMdmConfigurations(authObject)
            return mdmConfigurations.find((e) => e.payload_display_name === name)
        } catch (err) {
            throw err
        }
    }

    async getFileVaultKeys(authObject: IAddigyInternalAuthObject): Promise<object[]> {
        try {
            let res = await this._addigyRequest('https://prod.addigy.com/get_org_filevault_keys/', {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    origin: 'https://app-prod.addigy.com',
                },
                method: 'GET',
            })
            return JSON.parse(res.body)
        } catch (err) {
            throw err
        }
    }

    async getApnsCerts(
        authObject: IAddigyInternalAuthObject,
        next?: string,
        previous?: string,
    ): Promise<object[]> {
        let url = 'https://app-prod.addigy.com/api/apn/user/apn/list'
        if (next) {
            url = `${url}?next=${next}`
        }
        if (previous) {
            url = `${url}?previous=${previous}`
        }

        try {
            let res = await this._addigyRequest(url, {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    origin: 'https://app-prod.addigy.com',
                    email: authObject.emailAddress,
                    orgid: authObject.orgId,
                },
                method: 'GET',
            })
            return JSON.parse(res.body).items
        } catch (err) {
            throw err
        }
    }

    async getAuthObject(): Promise<IAddigyInternalAuthObject> {
        let postBody: any = {
            username: this.config.adminUsername,
            password: this.config.adminPassword,
        }

        try {
            if (!this.config.adminUsername || !this.config.adminPassword)
                throw new Error(
                    "The function you are using hits Addigy's internal API, but no username or password was provided in the constructor. Please fill out the adminUsername and adminPassword parameters.",
                )
            let res = await this._addigyRequest('https://prod.addigy.com/signin/', {
                method: 'POST',
                json: postBody,
            })

            let authObject = {
                orgId: res.body.orgid,
                authToken: res.body.authtoken,
                emailAddress: res.body.email,
            }

            return authObject
        } catch (err) {
            throw err
        }
    }

    async getImpersonationAuthObject(
        authObject: IAddigyInternalAuthObject,
        orgId: string,
    ): Promise<IAddigyInternalAuthObject> {
        let postBody: any = {
            orgid: orgId,
        }

        try {
            let res = await this._addigyRequest('https://prod.addigy.com/impersonate_org/', {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    origin: 'https://app-prod.addigy.com',
                },
                method: 'POST',
                json: postBody,
            })

            let impersonationAuthObject = {
                orgId: orgId,
                authToken: res.headers['set-cookie']
                    .find(
                        (e: string) =>
                            e.includes('auth_token') && !e.includes('original_auth_token'),
                    )
                    .split('auth_token=')[1]
                    .split(';')[0],
                emailAddress: authObject.emailAddress,
            }

            return impersonationAuthObject
        } catch (err) {
            throw err
        }
    }

    private async _addigyRequest(url: string, options: any): Promise<any> {
        try {
            let res = await got(url, options)
            return res
        } catch (err) {
            throw err
        }
    }
}
