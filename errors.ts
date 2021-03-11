export class SyntaxError {
  constructor(msg: string) {
    throw new Error(`SyntaxError: ${msg}`);
  }
}
