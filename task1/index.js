const encode = require('./encode.js');
const decode = require('./decode.js');
const { program } = require('commander');

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
class UpperCaseTransformer extends stream.Transform {
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
    callback();
  }
}

const read = fs.createReadStream(pathToRead);
const transform = new UpperCaseTransformer();
const write = fs.createWriteStream(pathToWrite);
read.on('error', err => {
  process.stderr.write(`Ошибочка. Err: ${err}`);
});
write.on('error', err => {
  process.stderr.write(`Ошибочка. Err: ${err}`);
});

read.pipe(transform).pipe(write);
