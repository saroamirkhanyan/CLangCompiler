enum TOKEN_TYPE {
  WHITESPACE,
  IDENTFIER,
  INTEGER,
  FLOAT,
  STRING,
  OPERATOR,
  COMMENT,
}

class UncaughtError {
  constructor(char: string) {
    throw new Error(
      `Uncaught SyntaxError: Invalid or unexpected token ${char}`
    );
  }
}

class Token {
  public type: TOKEN_TYPE = TOKEN_TYPE.WHITESPACE;
  public text: string = '';
}

export class Tokenizer {
  public parse(text: string) {
    const tokens: Array<Token> = [];
    let currentToken = new Token();
    for (let currChar of text) {
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
            new UncaughtError(currChar);
          }

          break;
        case 'a':
        case 'b':
        case 'c':
          if (currentToken.type == TOKEN_TYPE.WHITESPACE) {
            currentToken.type = TOKEN_TYPE.IDENTFIER;
          }
          if (
            currentToken.type == TOKEN_TYPE.IDENTFIER ||
            currentToken.type == TOKEN_TYPE.STRING ||
            currentToken.type == TOKEN_TYPE.COMMENT
          ) {
            currentToken.text += currChar;
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
        case '/':
          if (
            currentToken.type == TOKEN_TYPE.STRING ||
            currentToken.type == TOKEN_TYPE.COMMENT
          ) {
            currentToken.text += currChar;
          } else {
            if (currentToken.type != TOKEN_TYPE.WHITESPACE) {
              tokens.push(currentToken);
              currentToken = new Token();
            }
            currentToken.type = TOKEN_TYPE.OPERATOR;
            currentToken.text = currChar;
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
        case '\n':
          if (currentToken.type != TOKEN_TYPE.WHITESPACE) {
            if (currentToken.type != TOKEN_TYPE.COMMENT) {
              tokens.push(currentToken);
            }
            currentToken = new Token();
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
        case '#':
          if (currentToken.type != TOKEN_TYPE.WHITESPACE) {
            tokens.push(currentToken);
          }
          currentToken = new Token();
          currentToken.type = TOKEN_TYPE.COMMENT;
          break;
        default:
          new UncaughtError(currChar);
      }
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
