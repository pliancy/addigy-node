import { Payload } from '../types'

export interface FilevaultPayload extends Payload {
    enable?: 'On' | 'Off'
    defer?: boolean
    use_recovery_key?: boolean
    show_recovery_key?: boolean | null
    defer_dont_ask_at_user_logout?: boolean | null
    defer_force_at_user_login_max_bypass_attempts?: number | null
    addigy_payload_version?: number
    destroy_fv_key_on_standby?: boolean | null
    dont_allow_fde_disable?: boolean
    is_from_security_profile?: boolean
    encrypt_cert_payload_uuid?: string
    location?: string
    payload_priority?: number
    redirect_url?: string
}

export interface FilevaultRequest {
    enable?: boolean
    defer?: boolean
    showRecoveryKey?: boolean
    /**
     * Require user to unlock filevault after hibernation
     */
    destroyFvKeyOnStandby?: boolean
    /**
     * When enabled, the device will encrypt the personal recovery key with a certificate created by Addigy. The encrypted key will be stored in a secured database.
     */
    escrowRecoveryKey?: boolean
    deferDontAskAtUserLogout?: boolean
    deferForceAtUserLoginMaxBypassAttempts?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}
