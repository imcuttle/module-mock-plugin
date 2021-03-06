# module-mock-plugin

[![Build status](https://img.shields.io/travis/imcuttle/module-mock-plugin/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/module-mock-plugin)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/module-mock-plugin.svg?style=flat-square)](https://codecov.io/github/imcuttle/module-mock-plugin?branch=master)
[![NPM version](https://img.shields.io/npm/v/module-mock-plugin.svg?style=flat-square)](https://www.npmjs.com/package/module-mock-plugin)
[![NPM Downloads](https://img.shields.io/npm/dm/module-mock-plugin.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/module-mock-plugin)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> The plugin on enhanced-resolver for easy mock

## Why use it?

One day your project (using React) needs to change the browser's default hovering title behavior as a whole.
![1L5qn1.png](https://s2.ax1x.com/2020/02/13/1L5qn1.png)

This is a lot of work, so the implementation of small modifications is mock react module, so that the place where react is imported in the project points to our custom react module.

```text
src/
    __mock/
        react/ # custom react
node_modules/
    react/
```

- `src/__mock/react/index.js`

```javascript
import React from 'react'
export * from 'react'

export function createElement(type, props, children) {
  // ... custom code
}
```

## Installation

```bash
npm install module-mock-plugin
# or use yarn
yarn add module-mock-plugin
```

## Use in webpack

```javascript
const ModuleMockPlugin = require('module-mock-plugin')

const webpackConfig = {
  resolve: {
    plugins: [new ModuleMockPlugin()]
  }
}
```

## Options

Extends the options from [absolute-module-mapper-plugin](https://github.com/imcuttle/absolute-module-mapper-plugin)

#### `mockFilePath`

The path of mock directory, it could be inferred as the closest file from origin file, or assigning special file path by absolute path.

- Type: `string`
- Default: `__mocks`

#### `include`

The included paths for mapping

- Type: `Array<string|Function|RegExp>`
- Default: `[/^((?!\/node_modules\/).)*$/]`

#### `exclude`

The excluded paths for mapping

- Type: `Array<string|Function|RegExp>`
- Default: `[]`

## Related

- [absolute-module-mapper-plugin](https://github.com/imcuttle/absolute-module-mapper-plugin) - The plugin on enhanced-resolver to map module path.

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com">moyuyc95@gmail.com</a>.

## License

MIT - [imcuttle](https://github.com/imcuttle) 🐟
