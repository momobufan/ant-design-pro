import Rollbar from 'rollbar'; //美化滚动条

// Track error by rollbar.com

//location.host 包含端口，比如是 127.0.0.1:81。如果端口是 80，那么就没有端口，就是 127.0.0.1。
//location.hostname 不包含端口，比如是 127.0.0.1。

if (location.host === 'preview.pro.ant.design') {
  //console.log(12345)
  Rollbar.init({
    accessToken: '033ca6d7c0eb4cc1831cf470c2649971',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'production',
    },
  });
}
