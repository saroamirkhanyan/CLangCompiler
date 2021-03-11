import { UncaughtError } from './errors.ts';
import { Token, TOKEN_TYPE } from './Token.ts';
export default class Tokenizer {
  public parse(text: string) {
    const tokens: Array<Token> = [];
    let currentToken = new Token();
    let pos = 1;
    let line = 1;
    for (const currChar of text) {
      switch (currChar) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          if (currentToken.type == TOKEN_TYPE.WHITESPACE) {
            currentToken.type = TOKEN_TYPE.INTEGER;
          }
          currentToken.text += currChar;
          break;
        case '.':
          if (
            currentToken.type == TOKEN_TYPE.INTEGER ||
            currentToken.type == TOKEN_TYPE.STRING
          ) {
            if (currentToken.type == TOKEN_TYPE.INTEGER) {
              currentToken.type = TOKEN_TYPE.FLOAT;
            }
            currentToken.text += currChar;
          } else {
            new UncaughtError(currentToken);
          }
          break;
        case 'a':
        case 'b':
        case 'c':
        case 'C':
        case 'd':
        case 'e':
        case 'f':
        case 'g':
        case 'h':
        case 'H':
        case 'i':
        case 'I':
        case 'j':
        case 'k':
        case 'l':
        case 'm':
        case 'n':
        case 'o':
        case 'p':
        case 'q':
        case 'r':
        case 's':
        case 't':
        case 'u':
        case 'v':
        case 'w':
        case 'x':
        case 'y':
        case 'z':
          if (currentToken.type == TOKEN_TYPE.WHITESPACE) {
            currentToken = new Token();
            currentToken.type = TOKEN_TYPE.IDENTFIER;
          }
          if (
            currentToken.type == TOKEN_TYPE.IDENTFIER ||
            currentToken.type == TOKEN_TYPE.STRING
          ) {
            currentToken.text += currChar;
          }
          break;
        case '/':
          if (currentToken.type == TOKEN_TYPE.WHITESPACE) {
            currentToken.type = TOKEN_TYPE.OPERATOR;
            currentToken.text = currChar;
          } else if (currentToken.type == TOKEN_TYPE.OPERATOR) {
            currentToken.type = TOKEN_TYPE.COMMENT;
          }
          break;
        case '{':
        case '}':
        case '(':
        case ')':
        case '-':
        case '+':
        case ';':
        case ',':
        case '=':
        case '%':
          if (currentToken.type == TOKEN_TYPE.STRING) {
            currentToken.text += currChar;
          } else {
            if (currentToken.type != TOKEN_TYPE.WHITESPACE) {
              tokens.push(currentToken);
            }
            currentToken = new Token();
            currentToken.type = TOKEN_TYPE.OPERATOR;
            currentToken.text = currChar;
            currentToken.line = line;
            currentToken.pos = pos;
            tokens.push(currentToken);
            currentToken = new Token();
          }
          break;
        case ' ':
          if (
            currentToken.type == TOKEN_TYPE.STRING ||
            currentToken.type == TOKEN_TYPE.COMMENT
          ) {
            currentToken.text += currChar;
          } else if (currentToken.type != TOKEN_TYPE.WHITESPACE) {
            tokens.push(currentToken);
            currentToken = new Token();
          }
          break;
        case '\r':
        case '\n':
          if (currentToken.type == TOKEN_TYPE.COMMENT) {
            currentToken = new Token();
          }
          if (currentToken.type == TOKEN_TYPE.STRING) {
            currentToken.text += currChar;
          } else if (currentToken.type != TOKEN_TYPE.WHITESPACE) {
            tokens.push(currentToken);
            currentToken = new Token();
          }
          if (currentToken.type != TOKEN_TYPE.STRING) {
            line++;
            pos = 1;
          }
          break;
        case '"':
          if (currentToken.type == TOKEN_TYPE.WHITESPACE) {
            currentToken.type = TOKEN_TYPE.STRING;
          } else if (currentToken.type == TOKEN_TYPE.STRING) {
            tokens.push(currentToken);
            currentToken = new Token();
          }
          break;
        default:
          new UncaughtError(currentToken);
      }
      currentToken.pos = pos;
      currentToken.line = line;
      pos++;
    }
    if (
      currentToken.type != TOKEN_TYPE.WHITESPACE &&
      currentToken.type != TOKEN_TYPE.COMMENT
    ) {
      tokens.push(currentToken);
    }
    return tokens;
  }
}
