import { HttpCookieAgent, HttpsCookieAgent, type CookieOptions } from 'http-cookie-agent/http'
import { CookieJar } from 'tough-cookie'

function getCookieOptions(): CookieOptions {
    return { jar: new CookieJar() } as unknown as CookieOptions
}

export function getAxiosHttpAgents() {
    return {
        httpAgent: new HttpCookieAgent({ cookies: getCookieOptions() }),
        httpsAgent: new HttpsCookieAgent({ cookies: getCookieOptions() }),
    }
}
