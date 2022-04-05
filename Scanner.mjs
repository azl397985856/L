import { Token, TokenType } from './Token.mjs'

// TODO： 支持数字， 布尔等基础类型

export class Scanner {
    tokens = []
    source = "";
    last = 0
    current = 0
    line = 1
    column = 1
    keywords = new Set(['for', 'if', 'else', 'true', 'false', 'nil', 'const', 'let']);
    constructor(source) {
        this.source = source
    }
    scan() {
        console.log(this.source)
        while (this.current < this.source.length) {
            this.last = this.current;
            this.scanToken()
        }
        this.tokens.push(new Token(TokenType.EOF, null, this.line, this.column)); // EOF
        return this.tokens

    }
    scanToken() {
        const c = this.advance();
        // unary operators
        switch (c) {
            case '(': this.addToken(TokenType.LPAREN); break;
            case ')': this.addToken(TokenType.RPAREN); break;
            case '{': this.addToken(TokenType.LBRACE); break;
            case '}': this.addToken(TokenType.RBRACE); break;
            case ',': this.addToken(TokenType.COMMA); break;
            case '.': this.addToken(TokenType.DOT); break;
            case '-': this.addToken(TokenType.MINUS); break;
            case '+': this.addToken(TokenType.PLUS); break;
            case ';': this.addToken(TokenType.SEMICOLON); break;
            case '*': this.addToken(TokenType.STAR); break;
            // binary operators
            case '!':
                this.addToken(this.lookBehind('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
                break;
            case '=':
                this.addToken(this.lookBehind('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
                break;
            case '<':
                this.addToken(this.lookBehind('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case '>':
                this.addToken(this.lookBehind('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
            case '/':
                if (this.match('/')) {
                    // 遇到了注释，我们直接跳过
                    while (this.peek() != '\n' && this.current < this.source.length) this.advance();
                } else {
                    addToken(TokenType.SLASH);
                }
                break;
            // 第一个重点，字符串
            case '"': this.processString(); break;
            case ' ':
            case '\r':
            case '\t':
                // Ignore 
                break;

            case '\n': this.line++; this.column = 0; break;
            default:
                if (this.isAlpha(c)) {
                    this.processIdentifier();
                } else {
                    console.error(`Unexpected character at line ${this.line} column ${this.column}`);
                }
        }
    }

    match(expected) {
        if (this.current == this.source.length) return false;
        if (this.source[this.current] != expected) return false;
        this.current++;
        return true;
    }

    isDigit(c) {
        return c >= '0' && c <= '9';
    }

    isAlpha(c) {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c == '_';
    }
    isAlphaNumeric(c) {
        return this.isAlpha(c) || this.isDigit(c);
    }

    processIdentifier() {
        while (this.isAlphaNumeric(this.peek())) this.advance();
        const text = this.source.substring(this.last, this.current);
        const isKeyword = this.keywords.has(text)
        if (!isKeyword) {
            this.addToken(TokenType.IDENTIFIER);
        } else {
            // throw new Error(`unexpected identifier for keyword ${text}`);
            this.addToken(TokenType.KEYWORD);
        }

    }

    processString() {
        while (this.peek() != '"') {
            this.advance();
        }
        // 跳过末尾的 "
        this.advance();
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType.STRING, value);
    }

    peek() {
        if (this.current == this.source.length) return '\0';
        return this.source[this.current];
    }


    lookBehind(expected) {
        if (this.current == this.source.length) return false;
        if (this.source[this.current] != expected) return false;
        return true;
    }
    advance() {
        return this.source.charAt(this.current++);
    }

    addToken(type) {
        const text = this.source.substring(this.last, this.current);
        this.tokens.push(new Token(type, text, this.line, this.column));
    }
}