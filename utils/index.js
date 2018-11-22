const crypto = require('crypto');
const md5 = require('apache-md5');
const crypt = require('apache-crypt');
const bcryptjs = require('bcryptjs');

const assert = require('assert');

const sha1 = str => crypto.createHash('sha1').update(str).digest('hex');
const validate = data => {
  const o = {};
  o.data = data;
  o.required = function (err) {
    assert(this.data, err || 'Parameter is required');
    return this;
  };
  o.isString = function (err) {
    assert(typeof this.data === 'string', err || 'Parameter must be a string');
    return this;
  };
  o.trim = function () {
    this.data = this.data.trim();
    return this;
  };
  o.isLength = function (min = 1, max = 255) {
    assert(this.data.length >= min && this.data.length <= max, `Invalid length, min:${min}, max:${max}`);
    return this;
  };
  o.noSpaces = function (err) {
    assert(!this.data.includes(' '), 'Spaces are not allowed');
    return this;
  };
  o.isAscii = function (err) {
    const re = /^[\x00-\x7F]+$/;
    assert(re.test(this.data), err || 'Invalid Ascii characaters');
    return this;
  };
  o.val = function () {
    return this.data;
  };
  return o;
};
const toObj = str => [...new Map(str.split('\n').filter(x => x).map(x => x.split(':')))].reduce((k, v) => {
  k[v[0]] = v[1];
  return k;
}, {});
const bcrypt = (data, saltlen = 5) => {
  assert(data, 'Parameter is required');
  return bcryptjs.hashSync(data, saltlen);
};

module.exports = { md5, crypt, sha1, validate, bcrypt, toObj };
