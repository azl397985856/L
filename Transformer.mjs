

import { AST_TYPES } from './AST.mjs'

export class Transformer {
    constructor() {

    }

    traverser(ast, visitor) {
        function traverseArray(nodes, parent) {
            nodes.forEach(function (child) {
                traverseNode(child, parent);
            });
        }
        function traverseNode(node, parent, context) {
            const method = visitor[node.type]
            if (method) {
                method(node, parent, context)
            }
            switch (node.type) {
                case AST_TYPES.Program:
                    traverseArray(node.body, node)
                    break
                case AST_TYPES.Identifier:
                case AST_TYPES.Literal:
                case AST_TYPES.BinaryExpression:
                case AST_TYPES.CallExpression:
                case AST_TYPES.VariableDeclaration:
                case AST_TYPES.VariableDeclarator:
                case AST_TYPES.AssignmentExpression:
                    break
                default:
                    throw new TypeError(`node.type ${node.type} is not supported`)
            }
        }

        traverseNode(ast, null, {})
    }


    transformer(ast, visitor) {
        const newAst = {
            type: AST_TYPES.Program,
            body: [],
            sourceType: "script"
        };
        // visitor pattern
        this.traverser(ast, visitor);
        return newAst
    }
}


