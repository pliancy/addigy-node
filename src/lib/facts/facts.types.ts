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
