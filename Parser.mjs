import { TokenType } from "./Token.mjs";
import { AST_TYPES } from "./AST.mjs";

export class Parser {
    constructor(tokens) {
        this.tokens = tokens
        this.current = 0
        console.log('tokens', tokens)
    }
    parse() {
        const tokens = this.tokens

        function walk() {
            const token = tokens[this.current]
            console.log('process token', token)


            if (token.type === TokenType.STRING) {
                this.current++;
                return {
                    type: AST_TYPES.LiteralExpression,
                    value: JSON.parse(token.value),
                    row: token.value
                }
            }

            if (token.type === TokenType.KEYWORD) {
                if (token.value === 'const') {
                    this.current++;
                    const variable = walk.call(this)
                    this.current++
                    const rightVar = walk.call(this)

                    const declaration = {
                        type: AST_TYPES.VariableDeclarator,
                        id: variable,
                        init: rightVar
                    }

                    return {
                        type: AST_TYPES.VariableDeclaration,
                        declarations: [declaration],
                        kind: token.value,
                    };
                }
            }




            if (token.type === TokenType.IDENTIFIER) {
                if (tokens[this.current + 1].type === TokenType.DOT) {
                    if (tokens[this.current + 2].type === TokenType.IDENTIFIER) {
                        //  member expression
                        this.current += 2
                        return {
                            type: AST_TYPES.MemberExpression,
                            object: {
                                type: AST_TYPES.Identifier,
                                name: token.value
                            },
                            property: {
                                type: AST_TYPES.Identifier,
                                name: tokens[this.current].value
                            }
                        }
                    }
                } else if (tokens[this.current + 1].type === TokenType.LPAREN) {
                    //  call expression
                    this.current += 2
                    const args = []
                    while (tokens[this.current].type !== TokenType.RPAREN) {
                        args.push(walk.call(this))
                        if (tokens[this.current].type === TokenType.COMMA) {
                            this.current++
                        } else if (tokens[this.current].type !== TokenType.RPAREN) {
                            throw new TypeError(tokens[this.current].type)
                        }
                    }
                    this.current += 1
                    const callee = ast.body.pop()
                    return {
                        type: AST_TYPES.CallExpression,
                        callee,
                        arguments: args
                    }
                } else if (tokens[this.current + 1].type === TokenType.PLUS) {
                    //  binary expression
                    const left = {
                        type: AST_TYPES.Identifier,
                        name: tokens[this.current].value
                    }
                    this.current += 2;
                    const right = walk.call(this)
                    return {
                        type: AST_TYPES.BinaryExpression,
                        operator: '+',
                        left,
                        right,
                    };
                }

                this.current++;

                return {
                    type: AST_TYPES.Identifier,
                    name: token.value,
                };
            }
            if (token.type === TokenType.RPAREN) {
                return {}
            }
            if (token.type !== TokenType.EOF) {
                console.log(`curret ast.body: `, ast.body)
                throw new TypeError(token.type);
            }

            this.current += 1
        }

        const ast = {
            type: AST_TYPES.Program,
            body: [],
            sourceType: "script"
        };


        while (this.current < tokens.length) {
            const node = walk.call(this)
            if (node) {
                ast.body.push(node);
            }
        }
        return ast;
    }
}


