import React, { Fragment } from 'react'; //Fragment 一般是用来处理多个元素返回的情况，Fragment本身不转换为任何dom元素，是个空标签
import { Link, Redirect, Switch, Route } from 'dva/router';
//路由几个重要的api
//Link 类似a标签 属性 form,to 
//Redirect 重定向 都是跳转到某路由
// Switch 只能选择一个 Route或Redirect，依据他们的path匹配，选择第一满足条件的
// Route
import DocumentTitle from 'react-document-title';//为react是单页应用，所以我们可能需要根据不同的路由改变文档的title
import { Icon } from 'antd'; //引入字体图标
import GlobalFooter from '../components/GlobalFooter'; //引入全局底部组件
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import { getRoutes, getPageQuery, getQueryPath } from '../utils/utils';
//getRoutes 获取路由
////getQueryPath为了兼容以前的版本，都会  /user 都会跳到 /user/login这个登录页面

// console.log(getRoutes)

const links = [
  {
    key: 'help',
    title: '帮助',
    href: '',
  },
  {
    key: 'privacy',
    title: '隐私',
    href: '',
  },
  {
    key: 'terms',
    title: '条款',
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 蚂蚁金服体验技术部出品
  </Fragment>
);


//为了兼容以前的版本，都会  /user 都会跳到 /user/login这个登录页面
function getLoginPathWithRedirectPath() {
  const params = getPageQuery();
  const { redirect } = params;
  return getQueryPath('/user/login', {
    redirect,
  });
}

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Ant Design Pro';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Ant Design Pro`;
    }
    return title;
  }

  render() {
    const { routerData, match } = this.props;
    // console.log(routerData)
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>Ant Design</span>
                </Link>
              </div>
              <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect from="/user" to={getLoginPathWithRedirectPath()} />
            </Switch>
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
