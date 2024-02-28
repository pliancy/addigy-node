import { readdirSync, readFileSync } from 'node:fs'

describe('IndexBarrel', () => {
    const base = './src/lib'

    // Our exports from index.ts
    const exports = readFileSync('./src/index.ts', 'utf-8').split('\n')

    // get rid of blank line at the end
    exports.pop()

    // loop directories in ./lib
    const directories = readdirSync(base)
    for (const directory of directories) {
        const isRootTypesFile = directory === 'types.ts'

        // ignore files at the root of ./lib except types.ts
        if (!isRootTypesFile && /\.ts/.test(directory)) continue

        // ensure we've exported base types
        if (isRootTypesFile) {
            it(`exports types.ts from ${directory}`, () =>
                expect(exports.find((e) => e === `export * from './lib/types'`)).toBeTruthy())
        } else {
            // loop all files in directory
            const files = readdirSync(`${base}/${directory}`)
            for (const file of files) {
                // ignore tests
                if (/\.spec/.test(file)) continue

                // get file name without extension
                const fileWithoutExt = file.replace('.ts', '')

                // get class name (e.g., mdm-configurations => mdmconfigurations)
                const cls = fileWithoutExt.replace('-', '')

                // ensure all types and classes are exported
                if (/\.types/.test(file)) {
                    it(`exports ${file} from ${directory}`, () =>
                        expect(
                            exports.find(
                                (e) => e === `export * from './lib/${directory}/${fileWithoutExt}'`,
                            ),
                        ).toBeTruthy())
                } else {
                    it(`exports ${file} from ${directory}`, () => {
                        const exp = `export { ${cls} } from './lib/${directory}/${fileWithoutExt}'`
                        expect(exports.find((e) => e.toLowerCase() === exp)).toBeTruthy()
                    })
                }
            }
        }
    }
})
