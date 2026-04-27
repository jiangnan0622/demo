# REAL Market Making Demo

这是一个只保留“做市上架 / 回购上架”两张页面的最小可运行版本。

## 启动

```bash
npm install
npm run dev
```

打开：

- `/backEnd/marketMaking/repurchase`
- `/backEnd/marketMaking/repurchase/config`

## 说明

- 数据为前端 mock 数据
- 默认支持 `admin` 与 `marketMaker` 两种视角
- 通过 URL query 传 `role=marketMaker` 可查看做市商视角
