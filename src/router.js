import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router'; //引入路由
// routerRedux 跳转
// Switch 二选一
import { LocaleProvider, Spin } from 'antd'; // 引入 组件 国际化   加载
import zhCN from 'antd/lib/locale-provider/zh_CN'; //引入中文
import dynamic from 'dva/dynamic'; // 引入dva 内置了 dynamic 方法用于实现组件的动态加载
import { getRouterData } from './common/router'; //引入数据
import Authorized from './utils/Authorized'; //权限认证
import { getQueryPath } from './utils/utils';
import styles from './index.less';

const { ConnectedRouter } = routerRedux; //ConnectedRouter组件
const { AuthorizedRoute } = Authorized;

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />; ////全局设置有加载插件
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  // 总的  {/: {…}, /dashboard/analysis: {…}, /dashboard/monitor: {…}, /dashboard/workplace: {…}, /form/basic-form: {…}, …}
  // /:{name: undefined, authority: undefined, hideInBreadcrumb: undefined, component: ƒ}
  // /dashboard/analysis:{name: "分析页", authority: undefined, hideInBreadcrumb: undefined, component: ƒ}
  // /dashboard/monitor:{name: "监控页", authority: undefined, hideInBreadcrumb: undefined, component: ƒ}
  const UserLayout = routerData['/user'].component; //登录页面
  const BasicLayout = routerData['/'].component; //基础共用布局组件

  return (
    <LocaleProvider locale={zhCN}>
      {/* 全局中文 */}
      <ConnectedRouter history={history}>
        {/* 浏览器地址 */}
        <Switch>
          {/*  */}
          <Route path="/user" component={UserLayout} />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority={['admin', 'user']}
            redirectPath={getQueryPath('/user/login', {
              redirect: window.location.href,
            })}
            ////为了兼容以前的版本，都会  /user 都会跳到 /user/login这个登录页面
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
