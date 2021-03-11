import { Token, TOKEN_TYPE } from './Tokenizer.ts';
import { Nullable } from './helpers/helpers.ts';
import { SyntaxError } from './errors.ts';

enum TYPES {
  VOID,
  INTEGER,
  CHAR,
}

class Type {
  constructor(public name = '', public type: TYPES = TYPES.VOID) {}
}

class ParemeterDefinition {
  public name = '';
  public type = new Type();
}

class FunctionDefinition {
  public name = '';
  public parameterList: Array<ParemeterDefinition> = [];
}

export default class Parser {
  private currentTokenIdx = 0;
  private tokens: Array<Token> = [];
  private get currentToken() {
    return this.tokens[this.currentTokenIdx];
  }
  private get lastToken() {
    return this.tokens[this.tokens.length - 1];
  }
  private types = [
    new Type('int', TYPES.INTEGER),
    new Type('void', TYPES.VOID),
    new Type('char', TYPES.CHAR),
  ];
  public parse(tokens: Array<Token>) {
    this.tokens = tokens;
    while (this.currentTokenIdx != tokens.length) {
      if (this.expectFunctionDefinition()) {
      }
    }
  }

  expectIdentifier(name = ''): Nullable<Token> {
    if (this.currentToken.type != TOKEN_TYPE.IDENTFIER) {
      return null;
    }
    if (name && this.currentToken.text != name) {
      return null;
    }
    const returnToken = this.currentToken;
    this.currentTokenIdx++;
    return returnToken;
  }
  expectOperator(name = ''): Nullable<Token> {
    if (
      this.currentToken == this.lastToken ||
      this.currentToken.type != TOKEN_TYPE.OPERATOR ||
      (name && this.currentToken.text != name)
    ) {
      return null;
    }
    const returnToken = this.currentToken;
    this.currentTokenIdx++;
    return returnToken;
  }
  expectType(): Nullable<Type> {
    const possibleType = this.expectIdentifier();
    if (!possibleType) return null;
    const foundType = this.types.find((type) => type.name == possibleType.text);
    if (!foundType) {
      return null;
    }
    return foundType;
  }
  expectFunctionDefinition(): boolean {
    const possibleType = this.expectType();
    const startTokenIdx = this.currentTokenIdx;
    if (possibleType) {
      const possibleName = this.expectIdentifier();
      if (possibleName) {
        const possibleOperator = this.expectOperator('(');
        if (possibleOperator) {
          const func = new FunctionDefinition();
          func.name = possibleName.text;
          while (!this.expectOperator(')')) {
            console.log(this.currentToken);
            const possbileParamType = this.expectType();
            const possibleVariableName = this.expectIdentifier();
            const funcParemeter = new ParemeterDefinition();
            if (possbileParamType && possibleVariableName) {
              funcParemeter.name = possibleVariableName.text;
              funcParemeter.type = possbileParamType;
              func.parameterList.push(funcParemeter);
            }
            this.expectOperator(',');
          }
          return true;
        }
        this.currentTokenIdx = startTokenIdx;
      } else {
        this.currentTokenIdx = startTokenIdx;
      }
    }
    return false;
  }
}
