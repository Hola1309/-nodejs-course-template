const encode = require('./encode.js');
const decode = require('./decode.js');
const { program } = require('commander');
const readline = require('readline');
program
  .option('-d, --decode')
  .option('-e, --encode')
  .option('-s, --shift <shift>')
  .option('-i, --input <input>')
  .option('-o, --output <output>');

program.parse(process.argv);
const shift = +program.shift;
let string;
const stream = require('stream');
const fs = require('fs');
const path = require('path');
const pathToRead = path.join(__dirname, `${program.input}.txt`);
const pathToWrite = path.join(__dirname, `${program.output}.txt`);
class Shift extends stream.Transform {
  _transform(data, encoding, callback) {
    if (!program.shift) {
      process.stderr.write('Отсутствует параметр сдвига');
      process.exit(1);
    }
    if (!program.decode && !program.encode) {
      process.stderr.write('Отсутствует параметр действия. Введите -d & -e');
      process.exit(1);
    }

    string = data.toString();
    string = string.split('');
    if (program.decode) encode(string, shift);
    if (program.encode) decode(string, shift);
    this.push(string.join(''));
    if (!program.output) {
      console.log(string.join(''));
    } else {
      console.log('Data was successfully written.');
    }
    callback();
  }
}

const read = fs.createReadStream(pathToRead);
const transform = new Shift();
const write = fs.createWriteStream(pathToWrite);
read.on('error', err => {
  process.stderr.write(`Ошибочка. Err: ${err} \n`);
});
write.on('error', err => {
  process.stderr.write(`Ошибочка. Err: ${err} \n`);
});

read.pipe(transform).pipe(write);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

rl.on('line', line => {
  string = line;
  string = string.toString();
  string = string.split('');
  if (program.decode) encode(string, shift);
  if (program.encode) decode(string, shift);
  console.log(string.join(''));
});
