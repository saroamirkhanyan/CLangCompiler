import { Token, TOKEN_TYPE } from './Token.ts';
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
  public name;
  public type;
  constructor({ name = '', type }: { name: string; type: Type }) {
    this.name = name;
    this.type = type;
  }
}

class FunctionDefinition {
  public parameterList: Array<ParemeterDefinition> = [];
  constructor(public name: string = '') {}
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
    const startTokenIdx = this.currentTokenIdx;
    const possibleType = this.expectType();
    const possibleName = this.expectIdentifier();
    if (possibleType && possibleName && this.expectOperator('(')) {
      const func = new FunctionDefinition(possibleName.text);
      while (!this.expectOperator(')')) {
        const possbileParamType = this.expectType();
        if (!possbileParamType) {
          throw new SyntaxError('Expected Type after function declartation');
        }
        const funcParemeter = new ParemeterDefinition({
          type: possbileParamType,
          name: this.expectIdentifier()?.text || '',
        });
        func.parameterList.push(funcParemeter);

        if (this.expectOperator(')')) {
          break;
        }

        if (!this.expectOperator(',')) {
          new SyntaxError('Expected , after argument');
        }
      }
      // this.parseFunctionBody(func);
      return true;
    }
    this.currentTokenIdx = startTokenIdx;
    return false;
  }
}
