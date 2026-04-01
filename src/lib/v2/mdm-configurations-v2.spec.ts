import { randomUUID } from 'crypto'
import { MdmConfigurationsV2 } from './mdm-configurations-v2'
import { PPPCInput, ServiceManagementPayloadRule } from '../mdm/mdm.types'
import { FilevaultRequest } from '../files/files.types'
import { CreateWebContentFilterPayload, MdmConfigurationInput } from '../mdm/mdm.types'

jest.mock('crypto', () => ({
    ...jest.requireActual('crypto'),
    randomUUID: jest.fn(),
}))

const mockedRandomUUID = randomUUID as jest.MockedFunction<typeof randomUUID>

const MOCK_UUID = '00000000-0000-4000-8000-000000000000'
const MOCK_DATA = { payloads: [{ payload_display_name: 'test' }] }

function makeHttp(overrides: Partial<Record<'get' | 'post' | 'put' | 'delete', jest.Mock>> = {}) {
    return {
        get: jest.fn().mockResolvedValue({ data: MOCK_DATA }),
        post: jest.fn().mockResolvedValue({ data: MOCK_DATA }),
        put: jest.fn().mockResolvedValue({ data: MOCK_DATA }),
        delete: jest.fn().mockResolvedValue({ data: MOCK_DATA }),
        ...overrides,
    }
}

describe('MdmConfigurationsV2', () => {
    beforeEach(() => {
        mockedRandomUUID.mockReturnValue(MOCK_UUID)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    // -------------------------------------------------------------------------
    // Raw API endpoint methods
    // -------------------------------------------------------------------------

    describe('list', () => {
        it('calls GET /mdm/configurations/profiles and returns data', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)

            const result = await mdm.list()

            expect(result).toEqual(MOCK_DATA)
            expect(http.get).toHaveBeenCalledWith('/mdm/configurations/profiles')
        })
    })

    describe('get', () => {
        it('calls GET /mdm/configurations/profile/:id and returns data', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)

            const result = await mdm.get('group-id-1')

            expect(result).toEqual(MOCK_DATA)
            expect(http.get).toHaveBeenCalledWith('/mdm/configurations/profile/group-id-1')
        })
    })

    describe('delete', () => {
        it('calls DELETE /mdm/configurations/profile/:id and returns data', async () => {
            const http = makeHttp({ delete: jest.fn().mockResolvedValue({ data: 'deleted' }) })
            const mdm = new MdmConfigurationsV2(http as never)

            const result = await mdm.delete('group-id-1')

            expect(result).toBe('deleted')
            expect(http.delete).toHaveBeenCalledWith('/mdm/configurations/profile/group-id-1')
        })
    })

    describe('create', () => {
        it('calls POST /mdm/configurations/profile with payloads and returns data', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const payloads = [{ payload_display_name: 'Test', payload_type: 'com.apple.test' }]

            const result = await mdm.create(payloads)

            expect(result).toEqual(MOCK_DATA)
            expect(http.post).toHaveBeenCalledWith('/mdm/configurations/profile', { payloads })
        })
    })

    describe('createCustomProfile', () => {
        it('calls POST /mdm/configurations/custom-profile with FormData and clears content-type header', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const profile = Buffer.from('<plist></plist>')

            const result = await mdm.createCustomProfile(profile, { macos_minimum_version: '12.0' })

            expect(result).toEqual(MOCK_DATA)
            expect(http.post).toHaveBeenCalledTimes(1)
            const [url, body, config] = http.post.mock.calls[0]
            expect(url).toBe('/mdm/configurations/custom-profile')
            expect(body).toBeInstanceOf(FormData)
            expect(config).toEqual({ headers: { 'content-type': undefined } })
        })
    })

    describe('updatePayloads', () => {
        it('calls PUT /mdm/configurations/profiles/payloads with payloads', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const payloads = [{ payload_group_id: MOCK_UUID, payload_display_name: 'Updated' }]

            const result = await mdm.updatePayloads(payloads)

            expect(result).toEqual(MOCK_DATA)
            expect(http.put).toHaveBeenCalledWith('/mdm/configurations/profiles/payloads', {
                payloads,
            })
        })
    })

    describe('assignPolicies', () => {
        it('calls POST /mdm/configurations/profile/policies with groupId and policyIds', async () => {
            const http = makeHttp({ post: jest.fn().mockResolvedValue({ data: 'ok' }) })
            const mdm = new MdmConfigurationsV2(http as never)

            const result = await mdm.assignPolicies('group-1', ['policy-1', 'policy-2'])

            expect(result).toBe('ok')
            expect(http.post).toHaveBeenCalledWith('/mdm/configurations/profile/policies', {
                groupId: 'group-1',
                policyIds: ['policy-1', 'policy-2'],
            })
        })
    })

    describe('unassignPolicies', () => {
        it('calls DELETE /mdm/configurations/profile/policies with body', async () => {
            const http = makeHttp({ delete: jest.fn().mockResolvedValue({ data: 'ok' }) })
            const mdm = new MdmConfigurationsV2(http as never)

            const result = await mdm.unassignPolicies('group-1', ['policy-1'])

            expect(result).toBe('ok')
            expect(http.delete).toHaveBeenCalledWith('/mdm/configurations/profile/policies', {
                data: { groupId: 'group-1', policyIds: ['policy-1'] },
            })
        })
    })

    describe('listDefinitions', () => {
        it('calls GET /mdm/configurations/definitions and returns data', async () => {
            const http = makeHttp({
                get: jest.fn().mockResolvedValue({ data: [{ addigy_payload_type: 'com.test' }] }),
            })
            const mdm = new MdmConfigurationsV2(http as never)

            const result = await mdm.listDefinitions()

            expect(result).toEqual([{ addigy_payload_type: 'com.test' }])
            expect(http.get).toHaveBeenCalledWith('/mdm/configurations/definitions')
        })
    })

    describe('getDefinition', () => {
        it('calls GET /mdm/configurations/definition/:type and returns data', async () => {
            const http = makeHttp({
                get: jest.fn().mockResolvedValue({ data: { addigy_payload_type: 'com.test' } }),
            })
            const mdm = new MdmConfigurationsV2(http as never)

            const result = await mdm.getDefinition('com.test.payload')

            expect(result).toEqual({ addigy_payload_type: 'com.test' })
            expect(http.get).toHaveBeenCalledWith('/mdm/configurations/definition/com.test.payload')
        })
    })

    describe('listByPolicyAndType', () => {
        it('calls GET /mdm/configurations/policy/profiles with query params', async () => {
            const http = makeHttp({
                get: jest.fn().mockResolvedValue({ data: [{ payload_group_id: MOCK_UUID }] }),
            })
            const mdm = new MdmConfigurationsV2(http as never)

            const result = await mdm.listByPolicyAndType('policy-1', 'com.apple.test')

            expect(result).toEqual([{ payload_group_id: MOCK_UUID }])
            expect(http.get).toHaveBeenCalledWith('/mdm/configurations/policy/profiles', {
                params: { policy_id: 'policy-1', payload_type: 'com.apple.test' },
            })
        })
    })

    describe('queryPayloads', () => {
        it('calls POST /o/:orgId/mdm/payloads/query with request body', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const request = { payload_group_ids: [MOCK_UUID] }

            const result = await mdm.queryPayloads('org-1', request)

            expect(result).toEqual(MOCK_DATA)
            expect(http.post).toHaveBeenCalledWith('/o/org-1/mdm/payloads/query', request)
        })

        it('sends empty object when no request provided', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)

            await mdm.queryPayloads('org-1')

            expect(http.post).toHaveBeenCalledWith('/o/org-1/mdm/payloads/query', {})
        })
    })

    // -------------------------------------------------------------------------
    // Helper methods
    // -------------------------------------------------------------------------

    describe('createKernelExtensionPolicy', () => {
        it('creates kernel extension policy and posts to create endpoint', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)

            const result = await mdm.createKernelExtensionPolicy('Test KEP', true, {
                allowedTeamIdentifiers: ['TEAM123'],
                allowedKernelExtensions: [
                    { teamIdentifier: 'TEAM456', bundleIdentifiers: ['com.test.kext'] },
                ],
            })

            expect(result).toEqual(MOCK_DATA)
            expect(http.post).toHaveBeenCalledTimes(1)
            const [url, body] = http.post.mock.calls[0]
            expect(url).toBe('/mdm/configurations/profile')
            const payload = body.payloads[0]
            expect(payload.payload_type).toBe('com.apple.syspolicy.kernel-extension-policy')
            expect(payload.payload_display_name).toBe('Test KEP')
            expect(payload.allow_user_overrides).toBe(true)
            expect(payload.allowed_team_identifiers).toContain('TEAM123')
            expect(payload.allowed_kernel_extensions['TEAM456']).toEqual(['com.test.kext'])
        })

        it('creates kernel extension policy without optional extensions', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)

            await mdm.createKernelExtensionPolicy('Minimal KEP', false, {})

            const payload = http.post.mock.calls[0][1].payloads[0]
            expect(payload.allowed_team_identifiers).toEqual([])
            expect(payload.allowed_kernel_extensions).toEqual({})
        })
    })

    describe('createSystemExtensionPolicy', () => {
        it('creates system extension policy and posts to create endpoint', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)

            const result = await mdm.createSystemExtensionPolicy('Test SEP', false, {
                allowedTeamIdentifiers: ['TEAM123'],
                allowedSystemExtensions: [
                    { teamIdentifier: 'TEAM456', bundleIdentifiers: ['com.test.sysext'] },
                ],
                allowedSystemExtensionTypes: [
                    { teamIdentifier: 'TEAM789', bundleIdentifiers: ['driver'] },
                ],
            })

            expect(result).toEqual(MOCK_DATA)
            const payload = http.post.mock.calls[0][1].payloads[0]
            expect(payload.payload_type).toBe('com.apple.system-extension-policy')
            expect(payload.allowed_system_extensions['TEAM456']).toEqual(['com.test.sysext'])
            expect(payload.allowed_system_extensions_types['TEAM789']).toEqual(['driver'])
            expect(payload.allowed_team_identifiers).toContain('TEAM123')
        })
    })

    describe('createNotificationSettingsPolicy', () => {
        it('creates notification settings policy and posts to create endpoint', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const settings = [
                {
                    bundle_identifier: 'com.example.app',
                    notifications_enabled: true,
                    show_in_lock_screen: true,
                    show_in_notification_center: true,
                    sounds_enabled: true,
                    badges_enabled: true,
                    critical_alert_enabled: false,
                },
            ]

            const result = await mdm.createNotificationSettingsPolicy(
                'Test Notifications',
                settings,
            )

            expect(result).toEqual(MOCK_DATA)
            const payload = http.post.mock.calls[0][1].payloads[0]
            expect(payload.payload_type).toBe('com.apple.notificationsettings')
            expect(payload.notification_settings).toEqual(settings)
        })
    })

    describe('createServiceManagementPolicy', () => {
        it('creates service management policy with default priority', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const rules: ServiceManagementPayloadRule[] = [
                { comment: 'allow launchd', rule_type: 'LabelPrefix', rule_value: 'com.example' },
            ]

            const result = await mdm.createServiceManagementPolicy('Test SMP', rules)

            expect(result).toEqual(MOCK_DATA)
            const payload = http.post.mock.calls[0][1].payloads[0]
            expect(payload.payload_type).toBe('com.apple.servicemanagement')
            expect(payload.payload_priority).toBe(9)
            expect(payload.rules).toEqual(rules)
        })

        it('creates service management policy with custom priority', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)

            await mdm.createServiceManagementPolicy('Test SMP', [], 5)

            const payload = http.post.mock.calls[0][1].payloads[0]
            expect(payload.payload_priority).toBe(5)
        })
    })

    describe('createWebContentFilterPolicy', () => {
        it('creates web content filter policy with provided payload', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const webContentPayload: CreateWebContentFilterPayload = {
                user_defined_name: 'My Filter',
                plugin_bundle_id: 'com.example.filter',
                filter_grade: 'firewall',
            }

            const result = await mdm.createWebContentFilterPolicy('Test WCF', webContentPayload)

            expect(result).toEqual(MOCK_DATA)
            const payload = http.post.mock.calls[0][1].payloads[0]
            expect(payload.payload_type).toBe('com.apple.webcontent-filter')
            expect(payload.payload_priority).toBe(9)
            expect(payload.user_defined_name).toBe('My Filter')
            expect(payload.plugin_bundle_id).toBe('com.example.filter')
        })

        it('applies custom priority', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)

            await mdm.createWebContentFilterPolicy(
                'Test WCF',
                { user_defined_name: 'x', plugin_bundle_id: 'y', filter_grade: 'inspector' },
                3,
            )

            const payload = http.post.mock.calls[0][1].payloads[0]
            expect(payload.payload_priority).toBe(3)
        })
    })

    describe('createFilevaultPolicy', () => {
        it('creates filevault policy with two base payloads when escrow is false', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const filevault: FilevaultRequest = {
                enable: true,
                defer: true,
                escrowRecoveryKey: false,
            }

            const result = await mdm.createFilevaultPolicy('Test FV', filevault)

            expect(result).toEqual(MOCK_DATA)
            const { payloads } = http.post.mock.calls[0][1]
            expect(payloads).toHaveLength(2)
            expect(payloads[0].payload_type).toBe('com.apple.MCX.FileVault2')
            expect(payloads[0].enable).toBe('On')
            expect(payloads[1].payload_type).toBe('com.apple.MCX')
        })

        it('adds escrow payloads when escrowRecoveryKey is true', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const filevault: FilevaultRequest = {
                enable: true,
                defer: false,
                escrowRecoveryKey: true,
            }

            await mdm.createFilevaultPolicy('Test FV Escrow', filevault)

            const { payloads } = http.post.mock.calls[0][1]
            expect(payloads).toHaveLength(5)
            const types = payloads.map((p: any) => p.payload_type)
            expect(types).toContain('com.apple.security.pkcs1')
            expect(types).toContain('com.apple.security.FDERecoveryKeyEscrow')
            expect(types).toContain('com.apple.security.FDERecoveryRedirect')
        })

        it('maps enable false to Off', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)

            await mdm.createFilevaultPolicy('Test FV Off', {
                enable: false,
                defer: false,
                escrowRecoveryKey: false,
            })

            const payload = http.post.mock.calls[0][1].payloads[0]
            expect(payload.enable).toBe('Off')
        })

        it('uses custom payload priority', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)

            await mdm.createFilevaultPolicy(
                'Test FV Priority',
                { enable: true, defer: false, escrowRecoveryKey: false },
                5,
            )

            const payloads = http.post.mock.calls[0][1].payloads
            payloads.forEach((p: any) => expect(p.payload_priority).toBe(5))
        })
    })

    describe('createPPPCPolicy', () => {
        it('creates PPPC policy with accessibility service entry', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const pppcPolicy: PPPCInput[] = [
                {
                    identifier: 'com.example.app',
                    codeRequirement: 'identifier "com.example.app"',
                    services: [
                        { service: 'accessibility', allowed: true, identifierType: 'bundleID' },
                    ],
                },
            ]

            const result = await mdm.createPPPCPolicy('Test PPPC', pppcPolicy)

            expect(result).toEqual(MOCK_DATA)
            const payload = http.post.mock.calls[0][1].payloads[0]
            expect(payload.payload_type).toBe('com.apple.TCC.configuration-profile-policy')
            expect(payload.services.accessibility).toHaveLength(1)
            expect(payload.services.accessibility[0].identifier).toBe('com.example.app')
            expect(payload.services.accessibility[0].allowed).toBe(true)
        })

        it('creates PPPC policy with screen_capture service using authorization', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const pppcPolicy: PPPCInput[] = [
                {
                    identifier: 'com.example.app',
                    codeRequirement: 'identifier "com.example.app"',
                    services: [
                        {
                            service: 'screen_capture',
                            authorization: 'AllowStandardUserToSetSystemService',
                            identifierType: 'bundleID',
                        },
                    ],
                },
            ]

            await mdm.createPPPCPolicy('Test PPPC Screen', pppcPolicy)

            const payload = http.post.mock.calls[0][1].payloads[0]
            expect(payload.services.screen_capture[0].authorization).toBe(
                'AllowStandardUserToSetSystemService',
            )
        })

        it('creates PPPC policy with apple_events service', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const pppcPolicy: PPPCInput[] = [
                {
                    identifier: 'com.example.app',
                    codeRequirement: 'identifier "com.example.app"',
                    services: [
                        {
                            service: 'apple_events',
                            allowed: true,
                            identifierType: 'bundleID',
                            aeReceiverIdentifier: 'com.apple.finder',
                            aeReceiverIdentifierType: 'bundleID',
                            aeReceiverCodeRequirement: 'identifier "com.apple.finder"',
                        },
                    ],
                },
            ]

            await mdm.createPPPCPolicy('Test PPPC AE', pppcPolicy)

            const service = http.post.mock.calls[0][1].payloads[0].services.apple_events[0]
            expect(service.ae_receiver_identifier).toBe('com.apple.finder')
            expect(service.ae_receiver_identifier_type).toBe('bundleID')
        })
    })

    describe('createMdmCertificate', () => {
        it('creates MDM certificate and posts to create endpoint', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const input: MdmConfigurationInput = {
                payload_priority: 1,
                payload_content: 'base64content==',
                payload_certificate_file_name: 'cert.cer',
                payload_display_name: 'My Cert',
            }

            const result = await mdm.createMdmCertificate(input)

            expect(result).toEqual(MOCK_DATA)
            const payload = http.post.mock.calls[0][1].payloads[0]
            expect(payload.payload_type).toBe('com.apple.security.root')
            expect(payload.payload_content).toBe('base64content==')
            expect(payload.payload_certificate_file_name).toBe('cert.cer')
        })
    })

    describe('createMdmProfile', () => {
        it('wraps a single payload in an array and calls create', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const profile = { payload_display_name: 'Raw', payload_type: 'com.apple.test' }

            const result = await mdm.createMdmProfile(profile)

            expect(result).toEqual(MOCK_DATA)
            expect(http.post).toHaveBeenCalledWith('/mdm/configurations/profile', {
                payloads: [profile],
            })
        })

        it('passes an array of payloads directly to create', async () => {
            const http = makeHttp()
            const mdm = new MdmConfigurationsV2(http as never)
            const profiles = [
                { payload_display_name: 'Raw 1', payload_type: 'com.apple.test1' },
                { payload_display_name: 'Raw 2', payload_type: 'com.apple.test2' },
            ]

            await mdm.createMdmProfile(profiles)

            expect(http.post).toHaveBeenCalledWith('/mdm/configurations/profile', {
                payloads: profiles,
            })
        })
    })
})
