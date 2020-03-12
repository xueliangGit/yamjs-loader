# yamjs-loader

[![NPM version](https://img.shields.io/npm/v/yamjs-loader.svg?style=flat)](https://npmjs.com/package/yamjs-loader)

这是一个针对 `yamjs@^0.5.0` 应用的 webpack Loader;

该laoder 内置热更新模块，让你的yamjs 应用(组件)在开发时不刷新页面自动更新内容。

> 请注意：yamjs-loader应当使用yamjs0.5.0以上版本

使用方式，放在 babel 之前即可；

```js
// rule
{
  test: /\.js$/,
	use: [
		'babel-loader',
		'yamjs-loader'
	]
},
```

使用 `yamjs-cli` 创建应用将自动使用该 `loader`。

yamjs 加载器已经处理好`scss，stylus，less`的加载规则；使用相应的css预处理语言需要装相应的module