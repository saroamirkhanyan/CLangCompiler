import { Tokenizer, Parser } from './basic.ts';
import input from './helpers/input.ts';

async function main() {
  // while (true) {
  // let text = await input('basic > ');

  let tokens = new Tokenizer().parse(`
      // hello world
      void main (int argc, char argv) {
        double foo = 1.5 / 2;
        // apeh
        printf("Hello it has been %d years since I learned C \n", 2020)
      }
    `);
  let parsed = new Parser().parse(tokens);
  console.log(parsed);
  // }
}

main();
