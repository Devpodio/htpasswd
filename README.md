# @devpodio/htpasswd

- htpasswd utility to create,edit,view .htpasswd file

#### Usage
- `npm install @devpodio/htpasswd --save` or `yarn add @devpodio/htpasswd`
- `const HTPASSWD = require('@devpodio/htpasswd')`
- `const htpasswd = new HTPASSWD(options[Object])`

#### Options
- `options.path` - Absolute path to save the .htpasswd, defaults to `process.env.HOME` or `process.cwd()`
- `options.encryption` - Type of encryption to use. Accepted values: `bcrypt`,`sha1`,`md5`,`crypt`,`plain`. Defaults to `bcrypt`

#### Api
- `add` Add a new user, password `add(user[String],password[String])`
- `edit` Edit a user with a new password `edit(user[String],newpassword[String])`
- `delete` Delete a user from the list `delete(user[String])`
- `view` View the list of user and password => `returns [Object]`

#### Cli
- `htpasswd [command] <options>`
- `htpasswd --help` for more info