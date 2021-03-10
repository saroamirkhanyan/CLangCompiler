export default async function input(
  text: string = '',
  stdin = Deno.stdin,
  stdout = Deno.stdout
) {
  const buf = new Uint8Array(1024);

  // Write question to console
  await stdout.write(new TextEncoder().encode(text));

  // Read console's input into answer
  const n = <number>await stdin.read(buf);
  return new TextDecoder().decode(buf.subarray(0, n)).trim();
}
