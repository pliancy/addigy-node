import axios from 'axios'
import { Files } from './files'
import { IAddigyInternalAuthObject } from '../auth/auth.types'

jest.mock('axios')

const configMock = {
    clientId: 'testClientId',
    clientSecret: 'testClientSecret',
}

const authObjectMock = {
    authToken: 'testAuthToken',
} as IAddigyInternalAuthObject

describe('Files', () => {
    let files: Files

    beforeEach(() => {
        files = new Files(configMock)
        // @ts-ignore
        files['http'] = axios
    })

    describe('getFileUploadUrl', () => {
        it('gets file upload URL successfully', async () => {
            const fileName = 'testFile.txt'
            const uploadUrlMock = 'http://test-upload-url.com'
            ;(axios.get as jest.Mock).mockResolvedValue({ data: uploadUrlMock })

            const result = await files.getFileUploadUrl(fileName)
            expect(result).toBe(uploadUrlMock)
        })
    })

    describe('uploadFile', () => {
        it('uploads a file successfully', async () => {
            const uploadUrl = 'http://test-upload-url.com'
            const fileMock = { key: 'value' }
            const responseMock = { status: 'success' }
            ;(axios.put as jest.Mock).mockResolvedValue({ data: responseMock })

            const result = await files.uploadFile(uploadUrl, fileMock)
            expect(result).toEqual(responseMock)
        })
    })

    describe('getFileVaultKeys', () => {
        it('gets file vault keys successfully', async () => {
            const keysMock = ['key1', 'key2', 'key3']
            ;(axios.get as jest.Mock).mockResolvedValue({ data: keysMock })

            const result = await files.getFileVaultKeys(authObjectMock)
            expect(result).toEqual(keysMock)
        })
    })
})
