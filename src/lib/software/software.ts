import { AxiosInstance } from 'axios'
import { CreateSoftware, IAddigyInternalAuthObject } from '../../types'

export class Software {
    domain = ''

    reqHeaders = {}

    constructor(private readonly http: AxiosInstance) {}

    async getPublicSoftware(): Promise<object[]> {
        try {
            let res = await this.http.get(`${this.domain}/catalog/public`, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }

    async getCustomSoftware(): Promise<object[]> {
        try {
            let res = await this.http.get(`${this.domain}/custom-software`, {
                headers: this.reqHeaders,
            })
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }

    async getCustomSoftwareAllVersions(softwareId: string): Promise<object[]> {
        try {
            let res = await this.http.get(
                `${this.domain}/custom-software?identifier=${softwareId}`,
                { headers: this.reqHeaders },
            )
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }

    async getCustomSoftwareSpecificVersion(instructionId: string): Promise<object[]> {
        try {
            let res = await this.http.get(
                `${this.domain}/custom-software?instructionid=${instructionId}`,
                { headers: this.reqHeaders },
            )
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }

    /**
     * V1 API - Creates a custom software object in Addigy.
     * @param baseIdentifier
     * @param version
     * @param downloads
     * @param installationScript
     * @param condition
     * @param removeScript
     * @param priority
     * @returns
     */
    async createCustomSoftware(
        baseIdentifier: string,
        version: string,
        downloads: string[],
        installationScript: string,
        condition: string,
        removeScript: string,
        priority = 10,
    ): Promise<object[]> {
        let postBody: any = {
            base_identifier: baseIdentifier,
            version,
            downloads,
            installation_script: installationScript,
            condition,
            remove_script: removeScript,
            priority,
        }

        try {
            let res = await this.http.post(`${this.domain}/custom-software`, postBody, {
                headers: this.reqHeaders,
            })
            // Fun fact! This endpoint returns an empty string when successful. Yes, that is correct, an empty string...
            return res.data
        } catch (err) {
            throw err
        }
    }

    //
    // The following endpoints use Addigy's internal API. Use at your own risk.
    //

    /**
     *  Internal API - Creates a custom software object in Addigy. This is the internal API, so it is subject to change.
     *  Different from the V1 API, this allows for things like setting priority.
     * @param authObject
     * @param software
     * @returns
     */
    async createSoftwareInternal(
        authObject: IAddigyInternalAuthObject,
        software: CreateSoftware,
    ): Promise<Software> {
        const res = await this.http.post('https://app.addigy.com/api/software', software, {
            headers: {
                Cookie: `auth_token=${authObject.authToken};`,
                origin: 'https://app-prod.addigy.com',
            },
        })
        return JSON.parse(res.data)
    }
}
