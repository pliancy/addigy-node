import axios from 'axios'
import { IAddigyConfig } from '../types'
import { Urls } from '../addigy.constants'
import { IAddigyInternalAuthObject } from '../auth/auth.types'
import { getAxiosHttpAgents } from '../addigy.utils'

export class Files {
    private readonly http = axios.create({
        ...getAxiosHttpAgents(),
    })

    constructor(private readonly config: IAddigyConfig) {}

    async getFileUploadUrl(fileName: string, contentType?: string): Promise<string> {
        const headers = {
            'client-Id': this.config.clientId,
            'client-Secret': this.config.clientSecret,
            'file-name': fileName,
            'content-type': contentType ?? 'application/octet-stream',
        }

        try {
            let res = await this.http.get(`${Urls.fileManager}/api/upload/url`, {
                headers,
            })
            return res.data
        } catch (err) {
            throw err
        }
    }

    async uploadFile(uploadUrl: string, file: object, contentType?: string): Promise<object[]> {
        const headers = {
            'content-type': contentType ?? 'application/octet-stream',
        }

        try {
            let res = await this.http.put(uploadUrl, file, {
                headers,
            })
            return res.data
        } catch (err) {
            throw err
        }
    }

    async getFileVaultKeys(authObject: IAddigyInternalAuthObject): Promise<object[]> {
        try {
            let res = await this.http.get(`${Urls.api}/get_org_filevault_keys`, {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    origin: Urls.appProd,
                },
            })
            return res.data
        } catch (err) {
            throw err
        }
    }
}
