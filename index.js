const path = require('path');
const { promisify } = require('util');
const fs = require('fs');
const appendFileAsync = promisify(fs.appendFile);
const readFileAsync = promisify(fs.readFile);
const os = require('os');
const writeFileAsync = promisify(fs.writeFile);
const u = require('./utils');

let defaultOpts = {
  path: process.env.HOME || process.cwd(),
  encryption: 'bcrypt' // md5,sha1,crypt,plain

};

module.exports = class Htpasswd {
  constructor (opts = {}) {
    const self = this;
    self.opts = Object.assign(defaultOpts, opts);
    self.encryption = ['bcrypt', 'md5', 'crypt', 'plain'].includes(self.opts.encryption) ? self.opts.encryption : 'bcrypt';
    self.htfile = path.resolve(self.opts.path, '.htpasswd');
    self._ensureFile();
  }
  async add (user, pw) {
    const self = this;
    user = self._validate(user);
    pw = self._encryptPw(pw);
    return await appendFileAsync(self.htfile, `${user}:${pw}${os.EOL}`, 'utf8');
  }
  async edit (user, newpw) {
    const self = this;
    user = self._validate(user);
    newpw = self._encryptPw(newpw);
    const filetxt = await readFileAsync(self.htfile, 'utf8');
    return await writeFileAsync(self.htfile, self._editTxt(filetxt, user, `${user}:${newpw}`), 'utf8');
  }
  async delete (user) {
    const self = this;
    user = self._validate(user);
    const filetxt = await readFileAsync(self.htfile, 'utf8');
    return await writeFileAsync(self.htfile, self._editTxt(filetxt, user, ''), 'utf8');
  }
  async view () {
    const self = this;
    const filetxt = await readFileAsync(self.htfile, 'utf8');
    return u.toObj(filetxt);
  }
  _editTxt (txt, user, newtxt) {
    const re = new RegExp(`^${user}:.+\\n?$`, 'm');
    return txt.replace(re, newtxt);
  }
  _validate (data) {
    return u.validate(data).required().isString().trim().isAscii().noSpaces().isLength(4, 255).val();
  }
  _encryptPw (pw) {
    const self = this;
    pw = self._validate(pw);
    return self.encryption == 'plain' ? pw : u[self.encryption](pw);
  }
  _ensureFile () {
    const self = this;
    if (!fs.existsSync(self.htfile)) {
      fs.writeFileSync(self.htfile, '');
    }
  }
};
