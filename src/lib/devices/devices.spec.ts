import axios from 'axios'
import { Devices } from './devices'

jest.mock('axios')

describe('Devices', () => {
    let devices: Devices

    beforeEach(() => {
        devices = new Devices(axios, {
            clientId: 'testClientId',
            clientSecret: 'testClientSecret',
        })
    })

    describe('getOnlineDevices', () => {
        it('returns online devices successfully', async () => {
            // Mock the axios response
            ;(axios.get as jest.Mock).mockResolvedValue({
                data: ['onlineDevice1', 'onlineDevice2', 'onlineDevice3'],
            })

            await expect(devices.getOnlineDevices()).resolves.toEqual([
                'onlineDevice1',
                'onlineDevice2',
                'onlineDevice3',
            ])
        })
    })

    describe('getDevices', () => {
        it('returns all devices successfully', async () => {
            // Mock the axios response
            ;(axios.get as jest.Mock).mockResolvedValue({
                data: ['device1', 'device2', 'device3'],
            })

            await expect(devices.getDevices()).resolves.toEqual(['device1', 'device2', 'device3'])
        })
    })

    describe('getPolicyDevices', () => {
        it('returns policy devices successfully', async () => {
            // Mock the axios response
            ;(axios.get as jest.Mock).mockResolvedValue({
                data: ['policyDevice1', 'policyDevice2', 'policyDevice3'],
            })

            await expect(devices.getPolicyDevices('policyId')).resolves.toEqual([
                'policyDevice1',
                'policyDevice2',
                'policyDevice3',
            ])
        })
    })

    describe('updateDevicePolicy', () => {
        it('updates device policy successfully', async () => {
            // Mock the axios response
            ;(axios.post as jest.Mock).mockResolvedValue({
                data: ['policyUpdateResult1', 'policyUpdateResult2', 'policyUpdateResult3'],
            })

            await expect(devices.updateDevicePolicy('policyId', 'agentId')).resolves.toEqual([
                'policyUpdateResult1',
                'policyUpdateResult2',
                'policyUpdateResult3',
            ])
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
