import { Token, TOKEN_TYPE } from './Token.ts';
import { Nullable } from './helpers/helpers.ts';
import { SyntaxError } from './errors.ts';
import { Statements, Statement } from './Statements.ts';
import { Type, TYPES } from './Types.ts';

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
  public statments: Array<Statement> = [];
  constructor(public name: string = '') {}
}

export default class Parser {
  private currentTokenIdx = 0;
  private tokens: Array<Token> = [];
  private functions: Array<FunctionDefinition> = [];
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
    new Type('float', TYPES.FLOAT),
  ];

  public parse(tokens: Array<Token>) {
    this.tokens = tokens;

    while (this.currentTokenIdx != tokens.length) {
      if (this.expectFunctionDefinition()) {
      } else {
        break;
      }
    }
    console.log(this.functions);
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
      const statements: Nullable<Statement[]> = this.parseFunctionBody();
      this.parseFunctionBody();
      if (!statements) {
        this.currentTokenIdx = startTokenIdx;
        return false;
      }
      func.statments = statements;
      this.functions.push(func);
      return true;
    }
    this.currentTokenIdx = startTokenIdx;
    return false;
  }

  parseFunctionBody() {
    if (!this.expectOperator('{')) {
      return null;
    }
    const statements: Array<Statement> = [];
    while (!this.expectOperator('}')) {
      const statement = this.expectOneStatement();
      if (statement) {
        statements.push(statement);
      }

      // if (!this.expectOperator(';')) {
      //   throw new SyntaxError("Expected ';' at end of statement.");
      // }
      break;
    }
    return statements;
  }

  expectOneStatement() {
    if (this.currentToken.type == TOKEN_TYPE.FLOAT) {
      let name = this.currentToken.text;
      this.currentTokenIdx++;
      return new Statements.ValueStatment({
        name,
        type: new Type('float', TYPES.FLOAT),
      });
    }
    const possibleVariableDeclaration = this.expectVariableDeclaration();
    if (possibleVariableDeclaration) return possibleVariableDeclaration;

    const possibleFunctionCall = this.expectFunctionCall();
  }

  expectVariableDeclaration() {
    const possibleType = this.expectType();
    const possibleVariableName = this.expectIdentifier();
    if (!possibleType || !possibleVariableName) {
      return null;
    }
    if (this.expectOperator('=')) {
      let initialValue = this.expectOneStatement();

      if (!initialValue) {
        throw new SyntaxError('Expected initial value after =');
      }
    }
    return new Statements.VariableDeclaration({
      type: possibleType,
      name: possibleVariableName.text,
    });
  }

  expectFunctionCall() {}
}
