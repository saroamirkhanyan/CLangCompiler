import { Token } from './Token.ts';
export class SyntaxError {
  constructor(msg: string) {
    throw new Error(`SyntaxError: ${msg}`);
  }
}

export class UncaughtError {
  constructor(token: Token) {
    throw new Error(
      `Uncaught SyntaxError: Invalid or unexpected token ${token.text} at ${token.pos}:${token.line}`
    );
  }
}
