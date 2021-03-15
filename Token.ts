export enum TOKEN_TYPE {
  WHITESPACE,
  IDENTFIER,
  INTEGER,
  FLOAT,
  STRING,
  OPERATOR,
  COMMENT,
}

export class Token {
  public type: TOKEN_TYPE = TOKEN_TYPE.WHITESPACE;
  public text = '';
  public pos = 1;
  public line = 1;
}
