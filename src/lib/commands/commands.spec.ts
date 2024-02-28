import axios from 'axios'
import { Commands } from './commands'

jest.mock('axios')

describe('Commands', () => {
    describe('runCommand', () => {
        let commands: Commands

        beforeEach(() => {
            commands = new Commands(axios)
        })

        it('runs command successfully', async () => {
            // Mock the axios response
            ;(axios.post as jest.Mock).mockResolvedValue({
                data: ['commandData1', 'commandData2', 'commandData3'], // replace with your expected data structure
            })

            await expect(
                commands.runCommand(['agentId1', 'agentId2'], 'testCommand'),
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
                commands.runCommand(['agentId1', 'agentId2'], 'testCommand'),
            ).rejects.toThrow('Network Error')
        })
    })

    describe('getCommandOutput', () => {
        let commands: Commands

        beforeEach(() => {
            commands = new Commands(axios)
        })

        it('gets command output successfully', async () => {
            // Mock the axios response
            ;(axios.get as jest.Mock).mockResolvedValue({
                data: ['outputData1', 'outputData2', 'outputData3'], // replace with your expected data structure
            })

            await expect(commands.getCommandOutput('actionId', 'agentId')).resolves.toEqual([
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

            await expect(commands.getCommandOutput('actionId', 'agentId')).rejects.toThrow(
                'Network Error',
            )
        })
    })
})
