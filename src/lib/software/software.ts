import { AxiosInstance } from 'axios'
import { IAddigyInternalAuthObject } from '../auth/auth.types'
import { CreateSoftware, Software as ISoftware } from './software.types'
import { Urls } from '../addigy.constants'

export class Software {
    constructor(private readonly http: AxiosInstance) {}

    async getPublicSoftware(): Promise<ISoftware[]> {
        try {
            let res = await this.http.get(`catalog/public`)
            return res.data
        } catch (err) {
            throw err
        }
    }

    async getCustomSoftware(): Promise<ISoftware[]> {
        try {
            let res = await this.http.get(`custom-software`)
            return res.data
        } catch (err) {
            throw err
        }
    }

    async getCustomSoftwareAllVersions(softwareId: string): Promise<ISoftware[]> {
        try {
            let res = await this.http.get(`custom-software?identifier=${softwareId}`)
            return res.data
        } catch (err) {
            throw err
        }
    }

    async getCustomSoftwareSpecificVersion(instructionId: string): Promise<object[]> {
        try {
            let res = await this.http.get(`custom-software?instructionid=${instructionId}`)
            return res.data
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
            let res = await this.http.post(`custom-software`, postBody)
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
        const res = await this.http.post('software', software, {
            headers: {
                Cookie: `auth_token=${authObject.authToken};`,
                origin: Urls.appProd,
            },
        })
        return res.data
    }
}
