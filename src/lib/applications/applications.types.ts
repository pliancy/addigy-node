export interface InstalledApplicationsResponse {
    agentid: string
    installed_applications: Application[]
}

interface Application {
    name: string
    path: string
    version: string
}
