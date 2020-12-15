<h1 align="center">Welcome to mysqlnard 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/yy921010/mysqlext/wiki" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/yy921010/mysqlext/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> generate mysql statement through chain syntax

### 🏠 [Homepage](https://github.com/yy921010/mysqlext)

## Install

```sh
npm install mysqlnard --save
```

## Usage

```sh
import {SqlGenerator} from 'mysqlnard';

const sql = new SqlGenerator('select').from('table').build();
// SELECT * FROM table
```

## Run tests

```sh
npm run test
```

## Author

👤 **yy921010**

* Website: https://vineo.cn
* Github: [@yy921010](https://github.com/yy921010)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/yy921010/mysqlext/issues). You can also take a look at the [contributing guide](https://github.com/yy921010/mysqlext/blob/master/CODE_OF_CONDUCT.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [yy921010](https://github.com/yy921010).<br />
This project is [MIT](https://github.com/yy921010/mysqlext/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
