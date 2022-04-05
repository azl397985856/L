import { AST_TYPES } from './AST.mjs'

export class Generator {

    generate(node) {
        switch (node.type) {
            case AST_TYPES.Program:
                return node.body.map(this.generate.bind(this))
                    .join('\n')

            case AST_TYPES.CallExpression:
                return this.generate(node.callee) + '(' + node.arguments.map(this.generate.bind(this)) + ')'

            case AST_TYPES.VariableDeclaration:
                return (
                    node.kind + ' ' + node.declarations.map(this.generate.bind(this))
                )
            case AST_TYPES.VariableDeclarator:
                return (
                    this.generate.call(this, node.id) + ' = ' +
                    this.generate.call(this, node.init)
                )

            case AST_TYPES.LiteralExpression:
                return '"' + node.value + '"'

            case AST_TYPES.Identifier:
                return node.name
            case AST_TYPES.MemberExpression:
                return this.generate(node.object) + '.' + this.generate(node.property)
            case AST_TYPES.BinaryExpression:
                return this.generate(node.left) + ' ' + node.operator + ' ' + this.generate(node.right)
            case AST_TYPES.EOF:
                return ''
            default:
                throw new TypeError(node.type)
        }
    }

}