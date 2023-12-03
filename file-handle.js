const EventEmitter = require('events');

module.exports.FileHandle =

class FileHandle extends EventEmitter {
  constructor(path) {
    super();
    this._path = path;
    this._dir = dirname(this._path);
    this.lastContent = this.readSync();
    this._watchFile();
  }

  ensurePath() {
    fs.mkdirSync(this._dir, { recursive: true });
  }

  ensureFile() {
    if (!fs.existsSync(this._path)) {
      fs.writeFileSync(this._path, '');
    }
  }

  async _watchFile() {
    watchFile(this._path, content => {
      if (this.lastContent === null) {
        this.emit('create', content);
      } else if (content === null) {
        this.emit('delete', this.lastContent);
      }

      this.lastContent = content;
      this.emit('change', content);
    });
  }

  unwatchFile() {

  }

  readSync() {
    try {
      return fs.readFileSync(this._path, 'utf8');
    } catch (err) {
      return null;
    }
  }

  writeSync(data) {
    if (typeof data !== 'string'
      && !Buffer.isBuffer(data)) {
      data = String(data);
    }
    this.ensurePath();
    fs.writeFileSync(this._path, data, 'utf8');
  }

  async read() {
    return fs.promises.readFile(this._path, 'utf8')
      .catch(_ => null);
  }

  async write(data) {
    if (typeof data !== 'string'
      && !Buffer.isBuffer(data)) {
      data = String(data);
    }
    this.ensurePath();
    await fs.promises.writeFile(this._path, data, 'utf8');
  }

  get path() {
    return this._path;
  }
}

const fs = require('fs');
const { dirname } = require('path');
const { watchFile } = require('./watch-arbitrary-depth.js');
