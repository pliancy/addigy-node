export interface Device {
    'Passcode Compliant With Profiles': string
    'Battery Capacity Loss Percentage': number
    'Has Unlock Token': boolean
    'Malwarebytes Account ID'?: string | number
    'Authenticated Root Volume Enabled': boolean
    'Passcode Compliant'?: string | number
    MeId: string
    'Has Wireless': boolean
    'Local IP': string
    'Is Recovery Lock Enabled': null
    Timezone: string
    client_ip: string
    'Current MNC': string
    'Identity Username'?: string
    'Kernel Panic': boolean
    'Malwarebytes Suspicious Activity Detected'?: boolean
    'EAS Device Identifier': string
    'Personal Hotspot Enabled': boolean
    Malwarebytes: boolean
    user_override: string
    'Xcode Installed': boolean
    'Device Chip Type': string
    'MDM Last Connected': string
    'Build Version': string
    'Used Memory (GB)': number
    'Policy ID': string
    'LocalHost Name': string
    'External Boot Level': string
    'Java Vendor': string
    'SMART Failing': boolean
    'Gatekeeper Enabled': boolean
    'Firewall Allowed Applications'?: string[] | string
    'Identity Job Title'?: string
    'Is MDM Software Update Stuck': boolean
    Username?: string
    'Ethernet MAC Address': string
    'Firmware Password Allow Orams': boolean
    'Bandwidth Saved (GB)': number
    'Enrolled Via ADE': boolean
    'User Enrollment': boolean
    'Azure AD Device Ids'?: string[] | number[]
    'Passcode Lock Grace Period Enforced'?: boolean
    'Firewall Stealth Mode Enabled': boolean
    'Active Managed Users'?: number
    'Processor Speed (GHz)': number
    'macOS Version': string
    'MDM Update Eligibility': boolean
    'macOS Sonoma Support': boolean
    'Firewall Blocked Applications'?: string[] | string
    iMEI: string
    Locales: string[]
    'Last Online': string
    'Mac UUID': string
    '32-Bit Application Paths'?: string[]
    'Total Memory (GB)': 8
    'Battery Cycles': number
    'Is Activation Lock Manageable': boolean
    'Splashtop Version'?: string
    'Current MCC': string
    'Subscriber MCC': string
    'Uptime (days)': number
    'Peer Count': number
    'Admin Users': string[]
    Online: boolean
    'Is FindMy Enabled'?: boolean
    UDID: string
    'Serial Number': string
    'Subscriber Carrier': string
    Languages?: string[]
    'Warranty Days Left'?: number
    'Logged in iCloud Users'?: number
    'Audit Execution (seconds)': number
    'Cloud Backup Enabled': boolean
    'Total Disk Space (GB)': number
    'Max Resident Users': number
    'Bandwidth Served (GB)': number
    'Microsoft Company Portal Version'?: string
    'Bootstrap Token Required For Software Update': boolean
    'Files Served': number
    'LANCache Size (bytes)': number
    'Firmware Password Change Pending': boolean
    policy_id: string
    'Third-Party Agents': string[]
    'Device Model Name': string
    'Identity Provider Name'?: string
    'OS Version': string
    'Activation Lock Enabled': boolean
    'Sim Carrier': string
    'Ethernet MA CS'?: string
    'Current Carrier': string
    'System Version': string
    'Malwarebytes Version'?: string
    'Phone Number': string
    'OS Platform': string
    'Policy IDs': string[]
    'Identity Password Set Date'?: string | number | Date
    'Privileged MDM': boolean
    'Tmp Size (MB)': number
    'Bootstrap Token Allowed For Authentication': string
    'Third-Party Kernel Extensions'?: string[]
    'Has MDM': boolean
    'Wifi MAC Address'?: string
    'Product Name': string
    'Device Category'?: string
    'Carrier Settings Version': string
    'Has MDM Profile Approved': boolean
    'Product Description': string
    'Malwarebytes Nebula Machine ID'?: string | number
    'Battery Failures': number
    'Software Update Device ID': string
    'Battery Percentage': number
    'Cellular Technology': number
    'Identity Employee Department'?: string
    'Current User': string
    'Modem Firmware Version': string
    'Identity Office Location'?: string
    'Addigy Splashtop Installed'?: boolean
    'Bootstrap Token Required For Kernel Extension Approval': boolean
    'Active Users': string[]
    Compliant?: boolean
    'Is MDM Client Stuck': boolean
    'Azure AD User Ids'?: string[]
    'Passcode Lock Grace Period'?: string | number | Date
    'Firmware Password Exists': boolean
    'Subscriber MNC': string
    'Last Cloud Backup Date'?: string | number | Date
    'Identity Employee Type'?: string | number
    'Registration Date'?: string | number | Date
    'Secure Boot Level': string
    'Battery Charging': boolean
    agentid: string
    'Firewall Enabled': boolean
    'Identity Employee Hire Date'?: string | number | Date
    'Data Roaming Enabled': boolean
    'Is Apple Silicon'?: boolean
    'Identity Usage Location'?: string
    'Display On': boolean
    'Java Version'?: string
    'Third-Party Daemons': string[]
    'Last Reboot Timestamp': number
    'Malwarebytes Last Scan'?: string | number | Date
    'Do Not Disturb Enabled': boolean
    'MDM Activation Lock Enabled': boolean
    'Malwarebytes Suspicious Activity Count'?: string | number
    'Is Supervised': boolean
    'Hardware Encryption Capability (iOS only)'?: string
    'Bluetooth MAC': string
    'Voice Roaming Enabled': boolean
    'Firewall Block All Incoming Connections': boolean
    'Free Disk Space (GB)': number
    iCCID: string
    'Awaiting Configuration': boolean
    'Is Roaming': boolean
    'Free Disk Percentage': number
    'Installed Profiles': string[]
    'Battery Temperature(Fahrenheit)': number
    'System Integrity Protection Enabled': boolean
    'MDM Lost Mode Enabled': boolean
    'Splashtop ID': string
    'Addigy Identity Users'?: number
    'Processor Type': string
    'Hardware Model': string
    'Identity Mobile Phone'?: string
    'FileVault Enabled': boolean
    'Passcode Present'?: boolean
    'Battery Temperature(Celsius)': number
    'Remote Login Enabled': boolean
    'Agent Version': string
    'Time Machine Days Since Last Backup'?: number
    'Identity Email'?: string
    'FileVault Key Escrowed': boolean
    'Host Name'?: string
    'Is MDM Identity Certificate Installed': boolean
    'Location Service Enabled': boolean
    'Device Name': string
    'Malwarebytes Machine ID'?: string | number
    'Is Shared iPad'?: boolean
    'Remote Desktop Enabled': boolean
    'Days Since Last Cloud Backup'?: number
    'Is iCloud Enabled'?: boolean
    'Splashtop Installation Date'?: string | number | Date
    'Crashplan Days Since Last Backup'?: number
    'Policy Execution (seconds)': number
    'Addigy Identity Installed': boolean
    'Displays Serial Number'?: string
    'Identity User Display Name'?: string
    'Watchman Monitoring Installed': false
}
