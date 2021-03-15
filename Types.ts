export enum TYPES {
  VOID,
  INTEGER,
  FLOAT,
  CHAR,
}

export class Type {
  constructor(public name = '', public type: TYPES = TYPES.VOID) {}
}
