# LIMIT-translator

## how to use

### install
```shell
npm install
```

### config
* path 自动翻译检索路径
* outFile 导出模块路径(翻译启动器路径)
* extList 扫描文件类型
* blackMap 目录黑名单

### tool.config
* appId 有道app应用程序ID
* appKey 有道app应用程序密钥

### order 
```shell
# run
node */translate/index.js
#run by bun
bun */translate/index.js
# specify path
node */translate/index.js path=src
# clear old data
node */translate/index.js --clear
# manual translate , the path is output dir where you want!
node */translate/tool/index.js path=src/lang
```
