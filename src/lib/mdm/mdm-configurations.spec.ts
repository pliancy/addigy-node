import axios from 'axios'
import { MdmConfigurations } from './mdm-configurations'
import { IAddigyInternalAuthObject } from '../auth/auth.types'

jest.mock('axios')

describe('MdmConfigurations', () => {
    let mdmConfigurations: MdmConfigurations
    const authObject = { authToken: 'test_token' } as IAddigyInternalAuthObject

    beforeEach(() => {
        mdmConfigurations = new MdmConfigurations()
        // @ts-ignore
        mdmConfigurations['http'] = axios
    })

    describe('getMdmConfigurations', () => {
        it('gets mdm configurations data successfully', async () => {
            const mdmConfigurationsMockData = [
                { id: 1, name: 'Mdm Configuration 1' },
                { id: 2, name: 'Mdm Configuration 2' },
            ]
            ;(axios.get as jest.Mock).mockResolvedValue({
                data: { payloads: mdmConfigurationsMockData },
            })

            const result = await mdmConfigurations.getMdmConfigurations(authObject)
            expect(result).toEqual(mdmConfigurationsMockData)
        })
    })

    describe('getMdmConfigurationByName', () => {
        it('gets mdm configuration by name successfully', async () => {
            const mdmConfigurationsMockData = [
                { payload_display_name: 'Mdm Configuration 1', id: 1 },
                { payload_display_name: 'Mdm Configuration 2', id: 2 },
            ]
            ;(axios.get as jest.Mock).mockResolvedValue({
                data: { payloads: mdmConfigurationsMockData },
            })

            const result = await mdmConfigurations.getMdmConfigurationByName(
                authObject,
                'Mdm Configuration 1',
            )
            expect(result).toEqual({ payload_display_name: 'Mdm Configuration 1', id: 1 })
        })
    })
})
