import { Scanner } from './Scanner.mjs'
import { Parser } from './Parser.mjs'
import { Transformer } from './Transformer.mjs'
import { Generator } from './Generator.mjs'
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
    const parser = new Parser(tokens)
    const ast = parser.parse()
    const transformer = new Transformer(ast)
    transformer.transformer(ast, {
        // let -> var
        VariableDeclaration: function (node, parent, context) {
            node.kind = "var";
        },
        // ... 其他的转换
    })
    console.log(JSON.stringify(ast))
    const generator = new Generator()
    const code = generator.generate(ast)
    console.log(code)

}