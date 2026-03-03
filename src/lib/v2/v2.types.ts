export interface IAddigyV2Config {
    /** API key used for Addigy v2 `x-api-key` auth */
    apiKey: string
}

export type V2SortDirection = 'asc' | 'desc'

export interface V2ListOptions {
    page?: number
    perPage?: number
    sortField?: string
    sortDirection?: V2SortDirection
    paginate?: boolean
}

export interface V2PaginatedMetadata {
    page?: number
    per_page?: number
    page_count?: number
    total?: number
}

export interface V2PaginatedResponse<T> {
    items?: T[]
    metadata?: V2PaginatedMetadata
}

export type V2ListRequestBody = Record<string, unknown> & {
    page?: number
    per_page?: number
    sort_field?: string
    sort_direction?: V2SortDirection
}

export interface V2PaginationRequest {
    page: number
    per_page: number
}

export type DeviceFactType = 'string' | 'number' | 'boolean' | 'list' | 'date'

interface DeviceFactBase {
    error_msg?: string
}

export interface DeviceFactString extends DeviceFactBase {
    type: 'string'
    value: string | null
}

export interface DeviceFactNumber extends DeviceFactBase {
    type: 'number'
    value: number | null
}

export interface DeviceFactBoolean extends DeviceFactBase {
    type: 'boolean'
    value: boolean | null
}

export interface DeviceFactList extends DeviceFactBase {
    type: 'list'
    value: unknown[] | null
}

export interface DeviceFactDate extends DeviceFactBase {
    type: 'date'
    value: string | null
}

export interface DeviceFactUnknown extends DeviceFactBase {
    type?: string
    value?: unknown
}

export type DeviceFact =
    | DeviceFactString
    | DeviceFactNumber
    | DeviceFactBoolean
    | DeviceFactList
    | DeviceFactDate
    | DeviceFactUnknown

export interface DeviceFacts {
    '32_bit_applications'?: DeviceFactList
    active_managed_users?: DeviceFactList
    active_users?: DeviceFactList
    addigy_splashtop_installed?: DeviceFactBoolean
    admin_users?: DeviceFactList
    agent_version?: DeviceFactString
    agentid?: DeviceFactString
    audit_execution_time_seconds?: DeviceFactNumber
    authenticated_root_volume_enabled?: DeviceFactBoolean
    awaiting_configuration?: DeviceFactBoolean
    bandwidth_saved_gb?: DeviceFactNumber
    bandwidth_served_gb?: DeviceFactNumber
    battery_capacity_loss_percentage?: DeviceFactNumber
    battery_charging?: DeviceFactBoolean
    battery_cycles?: DeviceFactNumber
    battery_failures?: DeviceFactNumber
    battery_percentage?: DeviceFactNumber
    battery_temperature_fahrenheit?: DeviceFactNumber
    battery_temperaturecelsius?: DeviceFactNumber
    bluetooth_mac?: DeviceFactString
    bootstrap_token_allowed_for_authentication?: DeviceFactString
    bootstrap_token_required_for_kernel_extension_approval?: DeviceFactBoolean
    bootstrap_token_required_for_software_update?: DeviceFactBoolean
    build_version?: DeviceFactString
    carrier_settings_version?: DeviceFactString
    cellular_technology?: DeviceFactNumber
    client_ip?: DeviceFactString
    crashplan_days_since_last_backup?: DeviceFactNumber
    current_carrier_network?: DeviceFactString
    current_mcc?: DeviceFactString
    current_mnc?: DeviceFactString
    current_user?: DeviceFactString
    data_roaming_enabled?: DeviceFactBoolean
    days_since_last_cloud_backup?: DeviceFactNumber
    device_chip_type?: DeviceFactString
    device_model_name?: DeviceFactString
    device_name?: DeviceFactString
    display_on?: DeviceFactBoolean
    displays_serial_number?: DeviceFactList
    eas_device_identifier?: DeviceFactString
    enrolled_via_dep?: DeviceFactBoolean
    ethernet_ma_cs?: DeviceFactList
    ethernet_mac_address?: DeviceFactString
    external_boot_level?: DeviceFactString
    files_served?: DeviceFactNumber
    filevault_enabled?: DeviceFactBoolean
    filevault_key_escrowed?: DeviceFactBoolean
    firewall_allowed_applications?: DeviceFactList
    firewall_block_all_incoming_connections?: DeviceFactBoolean
    firewall_blocked_applications?: DeviceFactList
    firewall_enabled?: DeviceFactBoolean
    firewall_stealth_mode_enabled?: DeviceFactBoolean
    firmware_password_allow_orams?: DeviceFactBoolean
    firmware_password_change_pending?: DeviceFactBoolean
    firmware_password_exists?: DeviceFactBoolean
    free_disk_percentage?: DeviceFactNumber
    free_disk_space_gb?: DeviceFactNumber
    gatekeeper_enabled?: DeviceFactBoolean
    hardware_model?: DeviceFactString
    has_mdm?: DeviceFactBoolean
    has_mdm_profile_approved?: DeviceFactBoolean
    has_unlock_token?: DeviceFactBoolean
    has_wireless?: DeviceFactBoolean
    host_name?: DeviceFactString
    iccid?: DeviceFactString
    identity_installed?: DeviceFactBoolean
    identity_users?: DeviceFactList
    imei?: DeviceFactString
    installed_profiles?: DeviceFactList
    is_activation_lock_enabled?: DeviceFactBoolean
    is_activation_lock_manageable?: DeviceFactBoolean
    is_cloud_backup_enabled?: DeviceFactBoolean
    is_compliant?: DeviceFactBoolean
    is_device_locator_service_enabled?: DeviceFactBoolean
    is_do_not_disturb_in_effect?: DeviceFactBoolean
    is_mdm_activation_lock_enabled?: DeviceFactBoolean
    is_mdm_client_stuck?: DeviceFactBoolean
    is_mdm_identity_certificate_installed?: DeviceFactBoolean
    is_mdm_lost_mode_enabled?: DeviceFactBoolean
    is_mdm_softwareupdated_stuck?: DeviceFactBoolean
    is_roaming?: DeviceFactBoolean
    is_sonoma_ready?: DeviceFactBoolean
    is_supervised?: DeviceFactBoolean
    is_user_enrollment?: DeviceFactBoolean
    java_vendor?: DeviceFactString
    java_version?: DeviceFactString
    kernel_panic?: DeviceFactBoolean
    lan_cache_size_bytes?: DeviceFactNumber
    languages?: DeviceFactList
    last_cloud_backup_date?: DeviceFactDate
    last_online?: DeviceFactDate
    last_reboot_timestamp?: DeviceFactNumber
    local_ip?: DeviceFactString
    locales?: DeviceFactList
    localhost_name?: DeviceFactString
    mac_os_x_version?: DeviceFactString
    mac_uuid?: DeviceFactString
    manufactured_date?: DeviceFactDate
    maximum_resident_users?: DeviceFactNumber
    mb_endpoint_account_id?: DeviceFactString
    mb_endpoint_agent_version?: DeviceFactString
    mb_endpoint_machine_id?: DeviceFactString
    mb_endpoint_nebula_machine_id?: DeviceFactString
    mb_oneview_installed?: DeviceFactBoolean
    mdm_last_connected?: DeviceFactDate
    mdm_update_eligibility?: DeviceFactBoolean
    meid?: DeviceFactString
    microsoft_company_portal_version?: DeviceFactString
    modem_firmware_version?: DeviceFactString
    online?: DeviceFactBoolean
    os_platform?: DeviceFactString
    os_version?: DeviceFactString
    peer_count?: DeviceFactNumber
    personal_hotspot_enabled?: DeviceFactBoolean
    phone_number?: DeviceFactString
    policy_execution_seconds?: DeviceFactNumber
    policy_id?: DeviceFactString
    policy_ids?: DeviceFactList
    privileged_mdm?: DeviceFactBoolean
    processor_speed_ghz?: DeviceFactNumber
    processor_type?: DeviceFactString
    product_description?: DeviceFactString
    product_name?: DeviceFactString
    registration_date?: DeviceFactDate
    remote_desktop_enabled?: DeviceFactBoolean
    remote_login_enabled?: DeviceFactBoolean
    screenconnect_sessionid?: DeviceFactString
    secure_boot_level?: DeviceFactString
    serial_number?: DeviceFactString
    sim_carrier_network?: DeviceFactString
    smart_failing?: DeviceFactBoolean
    software_update_device_id?: DeviceFactString
    splashtop_id?: DeviceFactString
    splashtop_installation_date?: DeviceFactDate
    splashtop_version?: DeviceFactString
    subscriber_carrier_network?: DeviceFactString
    subscriber_mcc?: DeviceFactString
    subscriber_mnc?: DeviceFactString
    system_integrity_protection_enabled?: DeviceFactBoolean
    system_version?: DeviceFactString
    teamviewer_client_id?: DeviceFactString
    third_party_agents?: DeviceFactList
    third_party_daemons?: DeviceFactList
    third_party_kernel_extensions?: DeviceFactList
    time_machine_days_since_last_backup?: DeviceFactNumber
    time_machine_last_backup_date?: DeviceFactDate
    timezone?: DeviceFactString
    tmp_size_mb?: DeviceFactNumber
    total_disk_space_gb?: DeviceFactNumber
    total_memory_gb?: DeviceFactNumber
    udid?: DeviceFactString
    uptime_days?: DeviceFactNumber
    used_memory_gb?: DeviceFactNumber
    user_approved_enrollment?: DeviceFactBoolean
    voice_roaming_enabled?: DeviceFactBoolean
    warranty_days_left?: DeviceFactNumber
    warranty_expiration_date?: DeviceFactDate
    watchman_monitoring_installed?: DeviceFactBoolean
    wifi_mac_address?: DeviceFactString
    xcode_installed?: DeviceFactBoolean
}

export interface DeviceAudit {
    agent_audit_date?: string
    agentid?: string
    audit_date?: string
    facts?: DeviceFacts
    orgid?: string
}

export type DevicesListResponse = V2PaginatedResponse<DeviceAudit>

export type PolicyIcon =
    | 'fa fa-user'
    | 'fa fa-users'
    | 'fa fa-trophy'
    | 'fa fa-university'
    | 'fa fa-database'
    | 'fa fa-desktop'
    | 'fa fa-building-o'
    | 'fa fa-lock'
    | 'fa fa-dog'
    | 'fa fa-mobile'
    | 'fa fa-wrench'
    | 'fa fa-user-graduate'
    | 'fa fa-cog'
    | 'fa fa-laptop'
    | 'fa fa-box-open'
    | 'fa fa-globe-americas'

export interface RemoteControlSettings {
    enabled?: boolean
    require_user_permission?: boolean
}

export interface V2Policy {
    policyId?: string
    orgid?: string
    name?: string
    color?: string
    icon?: string
    parent?: string
    [key: string]: unknown
}

export type PoliciesListResponse = V2PaginatedResponse<V2Policy>

export interface CreatePolicyRequest {
    name: string
    color?: string
    icon?: PolicyIcon
    parent_policy_id?: string
    splashtop_settings?: RemoteControlSettings
    ssh_settings?: RemoteControlSettings
}

export interface InstalledCertificate {
    cert_org_name?: string
    common_name?: string
    data?: number[]
    device_uuid?: string
    is_identity?: boolean
    issuer_common_name?: string
    not_after?: string
    not_before?: string
    user_id?: string
    version?: number
}

export type CertsListResponse = V2PaginatedResponse<InstalledCertificate>

export interface OrganizationUser {
    addigy_role?: string
    email?: string
    name?: string
    orgid?: string
    phone?: string
    policies?: string[]
}

export type UsersListResponse = V2PaginatedResponse<OrganizationUser>

export interface UserUpdateRequest {
    email: string
    name: string
    role: string
    policies: string[]
    phone?: string
}

export type UserUpdateResponse = Record<string, unknown>

export type UserRemoveResponse = Record<string, unknown>
