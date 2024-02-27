import { AxiosInstance } from 'axios'
import { IAddigyConfig } from '../../types'

export class Files {
    domain = ''

    reqHeaders = {}

    constructor(
        private readonly http: AxiosInstance,
        private readonly config: IAddigyConfig,
    ) {}

    async getFileUploadUrl(fileName: string, contentType?: string): Promise<string> {
        const headers = {
            'client-Id': this.config.clientId,
            'client-Secret': this.config.clientSecret,
            'file-name': fileName,
            'content-type': contentType ?? 'application/octet-stream',
        }

        try {
            let res = await this.http.get(`https://file-manager-prod.addigy.com/api/upload/url`, {
                headers: headers,
            })
            return JSON.parse(res.data)
        } catch (err) {
            throw err
        }
    }

    async uploadFile(uploadUrl: string, file: object, contentType?: string): Promise<object[]> {
        const headers = {
            'content-type': contentType ?? 'application/octet-stream',
        }

        try {
            let res = await this.http.put(`${uploadUrl}`, file, {
                headers: headers,
            })
            return res.data
        } catch (err) {
            throw err
        }
    }
}
