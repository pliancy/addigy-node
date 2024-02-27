import { IAddigyConfig } from '../types'
import { Alerts } from './alerts/alerts'
import { Applications } from './apps/applications'
import { Billing } from './billing/billing'
import { Certs } from './certs/certs'
import { Commands } from './commands/commands'
import { Configs } from './configs/configs'
import { Devices } from './devices/devices'
import { Facts } from './facts/facts'
import { FileVault } from './file-vault/file-vault'
import { Files } from './files/files'
import { Integrations } from './integrations/integrations'
import { Maintenance } from './maintenance/maintenance'
import { Policies } from './policies/policies'
import { Profiles } from './profiles/profiles'
import { ScreenConnect } from './screenconnect/screenconnect'
import { Software } from './software/software'
import { Users } from './users/users'
import axios, { AxiosInstance } from 'axios'

export class Addigy {
    alerts: Alerts

    apps: Applications

    billing: Billing

    certs: Certs

    commands: Commands

    configs: Configs

    devices: Devices

    facts: Facts

    fileVault: FileVault

    files: Files

    integrations: Integrations

    maintenance: Maintenance

    policies: Policies

    profiles: Profiles

    screenconnect: ScreenConnect

    software: Software

    users: Users

    private readonly http: AxiosInstance

    constructor(private readonly config: IAddigyConfig) {
        const headers = {
            'content-type': 'application/json',
            accept: 'application/json',
            'client-id': this.config.clientId,
            'client-secret': this.config.clientSecret,
        }
        const baseURL = 'https://prod.addigy.com/api'
        this.http = axios.create({
            headers,
            baseURL,
        })

        this.alerts = new Alerts(this.http)
        this.apps = new Applications(this.http)
        this.billing = new Billing(this.http)
        this.certs = new Certs(this.http)
        this.commands = new Commands(this.http)
        this.configs = new Configs(this.http)
        this.devices = new Devices(this.http, this.config)
        this.facts = new Facts(this.http)
        this.fileVault = new FileVault(this.http)
        this.files = new Files(this.http, this.config)
        this.integrations = new Integrations(this.http)
        this.maintenance = new Maintenance(this.http)
        this.policies = new Policies(this.http)
        this.profiles = new Profiles(this.http)
        this.screenconnect = new ScreenConnect(this.http)
        this.software = new Software(this.http)
        this.users = new Users(this.http)
    }
}
