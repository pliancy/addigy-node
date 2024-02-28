import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent/http'
import { CookieJar } from 'tough-cookie'

export function getAxiosHttpAgents() {
    return {
        httpAgent: new HttpCookieAgent({ cookies: { jar: new CookieJar() } }),
        httpsAgent: new HttpsCookieAgent({ cookies: { jar: new CookieJar() } }),
    }
}
