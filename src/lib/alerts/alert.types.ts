export enum AlertStatus {
    Acknowledged = 'Acknowledged',
    Resolved = 'Resolved',
    Unattended = 'Unattended',
}

export interface Alert {
    category: string
    created_on: number
    status: AlertStatus
    valuetype: string
    value: string
    selector: 'changed' | string
    remtime: number
    fact_name: string
    _id: string
    emails: string[]
    created_date: Date
    name: string
    agentid: string
    level: 'warning' | 'error' | 'info' | string
    orgid: string
    remenabled: boolean
    fact_identifier: string
}
