import axios from 'axios'
import { Urls } from '../addigy.constants'
import { IAddigyInternalAuthObject } from '../auth/auth.types'
import { CustomFact } from './facts.types'
import { getAxiosHttpAgents } from '../addigy.utils'

export class Facts {
    private readonly http = axios.create({
        baseURL: `${Urls.appProd}/api/services/facts`,
        ...getAxiosHttpAgents(),
        headers: {
            origin: Urls.appProd,
        },
    })

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
        const res = await this.http.post('custom', body, {
            headers: {
                Cookie: `auth_token=${authObject.authToken};`,
            },
        })
        return res.data
    }

    async getCustomFacts(authObject: IAddigyInternalAuthObject): Promise<CustomFact[]> {
        const res = await this.http.get('custom', {
            headers: {
                Cookie: `auth_token=${authObject.authToken};`,
            },
        })

        const results = res.data
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
