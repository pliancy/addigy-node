export interface Software {
    name: string
    provider: string
    identifier: string
    version: string
    instruction_id: string
    base_identifier: string
    public_software_instruction_id: string
    fact_identifier: string
    run_on_success: boolean
    predefined_conditions: PredefinedConditions
    condition: string
    remove_script: string
    policy_restricted: boolean
    status_on_skipped: string
    user_email: string
    label: string
    public: boolean
    organization_id: string
    downloads: any[]
    profiles: any[]
    installation_script: string
    price_per_device: number
    priority: number
    tcc_version: number
    type: string
    category: string
    software_icon: SoftwareIcon
    description: string
    archived: boolean
}

export interface CreateSoftware {
    base_identifier: string
    version: string
    downloads: SoftwareDownload[]
    profiles: any[]
    installation_script: string
    remove_script: string
    condition: string
    predefined_conditions: PredefinedConditions
    public: boolean | null
    software_icon: SoftwareIcon
    run_on_success: boolean
    status_on_skipped: string
    priority: number
    category: string
}

export interface PredefinedConditions {
    os_version: OSVersion
    app_exists: AppExists
    file_exists: FileExists
    file_not_exists: FileExists
    profile_exists: ProfileExists
    process_not_running: ProcessNotRunning
    required_architecture: RequiredArchitecture
}

export interface AppExists {
    enabled: boolean
    operator: string
    version: string
    path: string
    install_if_not_present: boolean
}

export interface FileExists {
    enabled: boolean
    path: string
}

export interface OSVersion {
    enabled: boolean
    operator: string
    version: string
}

export interface ProcessNotRunning {
    enabled: boolean
    process_name: string
}

export interface ProfileExists {
    enabled: boolean
    profile_id: string
}

export interface RequiredArchitecture {
    enabled: boolean
    apple_silicon: boolean
}

export interface SoftwareIcon {
    orgid: string
    filename: string
    id: string
    provider: string
}

export interface SoftwareDownload {
    orgid: string
    created: Date
    content_type: string
    filename: string
    id: string
    md5_hash: string
    provider: string
    user_email: string
    size: number
}
