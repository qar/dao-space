# DaoSpace

> DaoCloud 内网闲聊社区


## 部署

#### OAuth 环境配置
[https://developer.atlassian.com/server/jira/platform/oauth/](https://developer.atlassian.com/server/jira/platform/oauth/)


## 启动开发环境

1. 先通过 docker-compose 启动依赖环境 (MongoDB, Redis): `docker-compose up`。
2. 在本地运行应用：`npm run start`


## 模拟生产环境

通过 `make build` 将应用打包成镜像，然后通过 `docker-compose -f docker-compose.staging.yaml up` 运行镜像。

----------
Nodeclub
=

[![build status][travis-image]][travis-url]
[![codecov.io][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]

[travis-image]: https://img.shields.io/travis/cnodejs/nodeclub/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/cnodejs/nodeclub
[codecov-image]: https://img.shields.io/codecov/c/github/cnodejs/nodeclub/master.svg?style=flat-square
[codecov-url]: https://codecov.io/github/cnodejs/nodeclub?branch=master
[david-image]: https://img.shields.io/david/cnodejs/nodeclub.svg?style=flat-square
[david-url]: https://david-dm.org/cnodejs/nodeclub
[node-image]: https://img.shields.io/badge/node.js-%3E=_4.2-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

## 介绍

Nodeclub 是使用 **Node.js** 和 **MongoDB** 开发的社区系统，界面优雅，功能丰富，小巧迅速，
已在Node.js 中文技术社区 [CNode(http://cnodejs.org)](http://cnodejs.org) 得到应用，但你完全可以用它搭建自己的社区。

## 安装部署


线上跑的是 [Node.js](https://nodejs.org) v8.12.0，[MongoDB](https://www.mongodb.org) 是 v4.0.3，[Redis](http://redis.io) 是 v4.0.9。

```
1. 安装 `Node.js[必须]` `MongoDB[必须]` `Redis[必须]`
2. 启动 MongoDB 和 Redis
3. `$ make install` 安装 Nodeclub 的依赖包
4. `cp config.default.js config.js` 请根据需要修改配置文件
5. `$ make test` 确保各项服务都正常
6. `$ node app.js`
7. visit `http://localhost:3000`
8. done!
```

## 测试

跑测试

```bash
$ make test
```

跑覆盖率测试

```bash
$ make test-cov
```

## 贡献

有任何意见或建议都欢迎提 issue，或者直接提给 [@alsotang](https://github.com/alsotang)

## License

MIT
