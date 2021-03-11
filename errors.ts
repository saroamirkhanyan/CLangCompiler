class SytaxError {
  constructor(msg: string) {
    throw new Error(`SyntaxError: ${msg}`);
  }
}
