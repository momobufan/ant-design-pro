import './polyfill'; //比如那些浏览器不支持 ES6 编译后，浏览器就支持了
import dva from 'dva'; //引入dva

import createHistory from 'history/createHashHistory';
//history 一个管理js应用session会话历史的js库。它将不同环境（浏览器，node...）的变量统一成了一个简易的API来管理历史堆栈、导航、确认跳转、以及sessions间的持续状态
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
//dva 有一个管理 effects 执行的 hook，并基于此封装了 dva-loading 插件。通过这个插件，我们可以不必一遍遍地写 showLoading 和 hideLoading，当发起请求时，插件会自动设置数据里的 loading 状态为 true 或 false 。然后我们在渲染 components 时绑定并根据这个数据进行渲染
import 'moment/locale/zh-cn';
//时间
import './rollbar'; //jq 美化滚动条
import './index.less';
// 1. Initialize
const app = dva({
  ////初始化
  history: createHistory(), //定义history属性,默认是 createHashHistory
});

// 2. Plugins
app.use(createLoading()); //使用全局使用加载插件

// 3. Register global model
app.model(require('./models/global').default); //注册model

// 4. Router
app.router(require('./router').default); // 注册router

// 5. Start
app.start('#root'); //挂载
// console.log(app._store);
export default app._store; // eslint-disable-line
