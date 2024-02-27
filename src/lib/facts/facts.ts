import { AxiosInstance } from 'axios'
import { CustomFact, IAddigyInternalAuthObject } from '../../types'

export class Facts {
    domain = ''

    reqHeaders = {}

    constructor(private readonly http: AxiosInstance) {}

    async createCustomFact(
        authObject: IAddigyInternalAuthObject,
        name: string,
        script: string,
        scriptType: 'bash' | 'python' | 'zsh',
    ): Promise<CustomFact> {
        const shebang = {
            bash: '#!/bin/bash',
            python: '#!/usr/bin/python',
            zsh: '#!/bin/zsh',
        }
        const body = {
            name,
            os_architectures: {
                linux_arm: {
                    is_supported: false,
                    language: '',
                    shebang: '',
                    script: '',
                },
                darwin_amd64: {
                    is_supported: true,
                    language: scriptType,
                    shebang: shebang[scriptType],
                    script,
                },
            },
            return_type: 'string',
        }
        const res = await this.http.post(
            'https://app-prod.addigy.com/api/services/facts/custom',
            body,
            {
                headers: {
                    Cookie: `auth_token=${authObject.authToken};`,
                    origin: 'https://app-prod.addigy.com',
                },
            },
        )
        return JSON.parse(res.data)
    }

    async getCustomFacts(authObject: IAddigyInternalAuthObject): Promise<CustomFact[]> {
        const res = await this.http.get('https://app-prod.addigy.com/api/services/facts/custom', {
            headers: {
                Cookie: `auth_token=${authObject.authToken};`,
                origin: 'https://app-prod.addigy.com',
            },
        })

        const results = JSON.parse(res.data)
        return results.custom_facts ?? []
    }

    async getCustomFactByName(
        authObject: IAddigyInternalAuthObject,
        name: string,
    ): Promise<CustomFact | undefined> {
        const facts = await this.getCustomFacts(authObject)
        return facts.find((e: any) => e.name === name)
    }
}
