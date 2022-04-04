import { Scanner } from './Scanner.mjs'
import fs from 'fs'
const argv = process.argv.slice(2)

if (argv.length > 1) {
    console.log(`usage: L [<file>]`)
} else if (argv == 0) {
    // TODO: JIT compile
    console.log(`JIT still under development`)
} else {
    const filename = argv[0]
    const source = fs.readFileSync(filename, 'utf8')
    const tokens = new Scanner(source).scan()
    console.log(tokens)
}