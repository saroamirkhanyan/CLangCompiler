import { Type, TYPES } from './Types.ts';

interface StatementParameters {
  name: string;
  type: Type;
}

export class Statement {
  constructor(public name: string, public type: Type) {}
}
export namespace Statements {
  export class VariableDeclaration extends Statement {
    constructor({ name = '', type }: StatementParameters) {
      super(name, type);
    }
  }
  export class ValueStatment extends Statement {
    constructor({ name = '', type }: StatementParameters) {
      super(name, type);
    }
  }
}
