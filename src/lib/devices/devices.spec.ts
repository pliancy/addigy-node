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

    describe('runCommand', () => {
        it('runs command successfully', async () => {
            // Mock the axios response
            ;(axios.post as jest.Mock).mockResolvedValue({
                data: ['commandData1', 'commandData2', 'commandData3'], // replace with your expected data structure
            })

            await expect(
                devices.runCommand(['agentId1', 'agentId2'], 'testCommand'),
            ).resolves.toEqual([
                'commandData1',
                'commandData2',
                'commandData3', // replace with your expected data
            ])
        })

        it('throws an error when the request fails', async () => {
            // Mock the axios error
            ;(axios.post as jest.Mock).mockImplementation(() => {
                throw new Error('Network Error') // replace with your expected error
            })

            await expect(
                devices.runCommand(['agentId1', 'agentId2'], 'testCommand'),
            ).rejects.toThrow('Network Error')
        })
    })

    describe('getCommandOutput', () => {
        it('gets command output successfully', async () => {
            // Mock the axios response
            ;(axios.get as jest.Mock).mockResolvedValue({
                data: ['outputData1', 'outputData2', 'outputData3'], // replace with your expected data structure
            })

            await expect(devices.getCommandOutput('actionId', 'agentId')).resolves.toEqual([
                'outputData1',
                'outputData2',
                'outputData3', // replace with your expected data
            ])
        })

        it('throws an error when the request fails', async () => {
            // Mock the axios error
            ;(axios.get as jest.Mock).mockImplementation(() => {
                throw new Error('Network Error') // replace with your expected error
            })

            await expect(devices.getCommandOutput('actionId', 'agentId')).rejects.toThrow(
                'Network Error',
            )
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
