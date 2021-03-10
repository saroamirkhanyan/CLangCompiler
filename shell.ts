import { Tokenizer } from './basic.ts';
import input from './helpers/input.ts';

async function main() {
  while (true) {
    let text = await input('basic > ');
    let parsedText = new Tokenizer().parse(text);
    console.log(parsedText);
  }
}

main();
