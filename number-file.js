const EventEmitter = require('events');

module.exports.NumberFile =

class NumberFile extends EventEmitter {
  constructor(name = 'x') {
    super();
    this._name = name;
    this._path = `data/num-${name}`;
    this._file = new FileHandle(this._path);
    this._number = +this._file.readSync();
    this._watchFile();
  }

  getNumber() {
    return this._number;
  }

  async setNumber(number) {
    number = Number(number);
    
    if (number === this._number) return;

    this._number = number;
    this.emit('change', number);

    await this._file.write(number);
  }

  _watchFile() {
    this._file.on('change', number => {
      number = Number(number);

      if (number === this._number) return;

      this._number = number;
      this.emit('change', number);
    });
  }

  get name() {
    return this._name;
  }

  get file() {
    return this._file;
  }
}

const { FileHandle } = require('./file-handle.js');
