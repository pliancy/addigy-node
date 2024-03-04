import { AxiosInstance } from 'axios'
import { Profile } from './profiles.types'

export class Profiles {
    constructor(private readonly http: AxiosInstance) {}

    async getProfiles(instructionId?: string): Promise<Profile[]> {
        let instructionUri = ''
        if (instructionId !== undefined) {
            instructionUri = `?instruction_id=${instructionId}`
        }

        try {
            let res = await this.http.get(`profiles` + instructionUri)
            return res.data
        } catch (err) {
            throw err
        }
    }

    async createProfile(name: string, payloads: object[]): Promise<Profile> {
        let postBody: any = {
            name: name,
            payloads: payloads,
        }

        try {
            let res = await this.http.post(`profiles`, postBody)
            return res.data
        } catch (err) {
            throw err
        }
    }

    async updateProfile(instructionId: string, payloads: object[]): Promise<Profile> {
        let postBody: any = {
            instruction_id: instructionId,
            payloads: payloads,
        }

        try {
            let res = await this.http.put(`profiles`, postBody)
            return res.data
        } catch (err) {
            throw err
        }
    }

    async deleteProfile(instructionId: string): Promise<Profile> {
        try {
            let res = await this.http.delete(`profiles`, {
                params: { instruction_id: instructionId },
            })
            return res.data
        } catch (err) {
            throw err
        }
    }
}
