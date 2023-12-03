module.exports.IdMaster =

class IdMaster {
  constructor(name) {
    this._name = name;
    this._numFile = new NumberFile(`id-${name}`);
    this._lastId = this._numFile.getNumber() || 0;
    this._watchFile();
  }

  getId() {
    const id = ++this._lastId;

    this._numFile.setNumber(id);
    
    return id;
  }

  _watchFile() {
    this._numFile.on('change', id => {
      if (id === this._lastId) return;

      this._lastId = id;
    });
  }

  get name() {
    return this._name;
  }

  get lastId() {
    return this._lastId;
  }

  get numFile() {
    return this._numFile;
  }
}

const { NumberFile } = require('./number-file.js');
