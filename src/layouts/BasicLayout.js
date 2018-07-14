import React, { Fragment } from 'react'; //{Fragment} 快捷方式，不用 React.Fragment()这样子写了
import PropTypes from 'prop-types'; //利用prop-types第三方库对组件的props中的变量进行类型检测
import { Layout, Icon, message } from 'antd'; //引入几个组件
import DocumentTitle from 'react-document-title'; //为react是单页应用，所以我们可能需要根据不同的路由改变文档的title
import { connect } from 'dva'; //不懂
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query'; //不懂
import classNames from 'classnames'; //引入classNames
{
  /* <div className=classnames({
    'class1': true,
    'class2': true
    )>
</div> */
}
import pathToRegexp from 'path-to-regexp'; //路径字符串中使用正则
import { enquireScreen, unenquireScreen } from 'enquire-js'; //响应css媒体查询
import GlobalHeader from '../components/GlobalHeader'; //全局头部组件
import GlobalFooter from '../components/GlobalFooter'; //全局底部组件
import SiderMenu from '../components/SiderMenu'; //全局侧边栏组件
import NotFound from '../routes/Exception/404'; // 不存在页面
import { getRoutes } from '../utils/utils'; // 方法筛选
import Authorized from '../utils/Authorized'; //权限验证
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.svg';

const { Content, Header, Footer } = Layout; //布局
const { AuthorizedRoute, check } = Authorized;
//AuthorizedRoute是Authorized组件的一个属性。在../utils/Authorized.js中。
//其中getAuthority()获取用户存放在localStorage的权限记录。Authorized是由RenderAuthorized(getAuthority())生成

// console.log(12121212,getRoutes);

/**
 * 根据菜单取得重定向地址.
 */
// console.log(787878,getMenuData());
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);
// redirectData(),获取每个第一个子级
// 0:{from: "/dashboard", to: "/dashboard/analysis"}
// 1:{from: "/dashboard/analysis", to: "/dashboard/analysis/monitor"}
// 2:{from: "/form", to: "/form/basic-form"}
// 3:{from: "/list", to: "/list/table-list"}
// 4:{from: "/list/search", to: "/list/search/articles"}
// 5:{from: "/profile", to: "/profile/basic"}
// 6:{from: "/result", to: "/result/success"}
// 7:{from: "/exception", to: "/exception/403"}
// 8:{from: "/user", to: "/user/login"}
// console.log(147147,getMenuData()); 菜单getMenuData没有变化
// console.log(47474747,redirectData);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  // console.log(menuData);
  // console.log(routerData)
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    
    if (i.children) {
      // Object.assign(target, ...sources)  target:目标对象， sources:源对象   返回值:目标对象
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  // console.log(Object.assign({}, routerData, result, childResult))
  return Object.assign({}, routerData, result, childResult);
};
//getBreadcrumbNameMap //是为了把所有父级的路由也列出来

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});
//不懂

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    isMobile,
  };

// https://segmentfault.com/a/1190000002878442
  getChildContext() {
    const { location, routerData } = this.props;
    // console.log(22228888,routerData);
    // console.log(location);
    //routerData以path做key的所有项
    //location {pathname: "/dashboard/analysis/monitor", search: "", hash: "", state: undefined}
    //pathname:当前页面路径
    // console.log(getBreadcrumbNameMap(getMenuData(), routerData))
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
    };
  }
//getChildContext 这个方法就是设置 context 的过程，它返回的对象就是 context，所有的子组件都可以访问到这个对象。

  //生命周期
  //componentDidMount()
  //在第一次渲染后调用，只在客户端。之后组件已经生成了对应的DOM结构，可以通过this.getDOMNode()来进行访问。 如果你想和其他JavaScript框架一起使用，可以在这个方法中调用setTimeout, setInterval或者发送AJAX请求等操作(防止异部操作阻塞UI)
  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  }
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Ant Design Pro';
    let currRouterData = null;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    }); //筛选出文字，依据key
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - Ant Design Pro`;
    }
    return title;
  }

  getBaseRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);
    // console.log(urlParams);
    const redirect = urlParams.searchParams.get('redirect');
    // console.log(33333333,redirect);
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
      //封装好了一个函数 replaceState;
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      ); //不懂
      // console.log(66666,authorizedPath)
      return authorizedPath;
    }
    return redirect;
  };

  //点击按钮，侧边栏收缩
  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  //清除通知
  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  //退出登录
  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'triggerError') {
      dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };


  //获取所有消息
  handleNoticeVisibleChange = visible => {
    const { dispatch } = this.props;
    console.log(123456)
    if (visible) {
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      notices,
      routerData,
      match,
      location,
    } = this.props;

    const { isMobile: mb } = this.state;
    // console.log(this.state);
    // console.log(isMobile)
    const bashRedirect = this.getBaseRedirect();
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          Authorized={Authorized}
          menuData={getMenuData()} //目录栏信息
          collapsed={collapsed}
          location={location} //对象 里面包含 pathname
          isMobile={mb}
          onCollapse={this.handleMenuCollapse} //最顶端的左边管理菜单点击，左边栏收缩
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser} //当前登陆者信息
              fetchingNotices={fetchingNotices} //搜索信息
              notices={notices} //最顶端的右边通知信息
              collapsed={collapsed} //关于点击最上边管理格是否可以收缩有关系，去掉的话点一次，就收，再次就不展开了
              isMobile={mb}
              onNoticeClear={this.handleNoticeClear} //最顶端的右边信息通知点击清空通知
              onCollapse={this.handleMenuCollapse} //最顶端的左边管理菜单点击，左边栏收缩
              onMenuClick={this.handleMenuClick} //最顶端的右边个人中心----点击退出登录，触发报错
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <Switch>
              {/* Switch组件 它的特性是我们只渲染所匹配到的第一个路由组件，
            一般界面渲染的时候，会渲染所有匹配到的路由组件。
            它的孩子节点只能是Route组件或者Redirect组件。 */}
              {redirectData.map(item => (
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
              {getRoutes(match.path, routerData).map(item => (
                // 循环生成
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact} //
                  authority={item.authority}
                  redirectPath="/exception/403"
                />
              ))}
              {/*  至此可知。结合路由生成是调用AuthorizedRoute组件封装和AuthorizedRoute组件的功能 */}
              {/*  当 authority={item.authority}权限通过的时候，及生成路由组件Route，该路由对应的组件为component={item.component};
              当权限不通过时，即加载nomatch生成的组件Route，此时重定向到redirectPath=”/exception/403”*/}
              <Redirect exact from="/" to={bashRedirect} />
              {/* 不明白这个跟282行会不会重复 */}
              <Route render={NotFound} />
            </Switch>
          </Content>
          <Footer style={{ padding: 0 }}>
            <GlobalFooter
              links={[
                {
                  key: 'Pro 首页',
                  title: 'Pro 首页',
                  href: 'http://pro.ant.design',
                  blankTarget: true,
                },
                {
                  key: 'github',
                  title: <Icon type="github" />,
                  href: 'https://github.com/ant-design/ant-design-pro',
                  blankTarget: true,
                },
                {
                  key: 'Ant Design',
                  title: 'Ant Design',
                  href: 'http://ant.design',
                  blankTarget: true,
                },
              ]}
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> 2018 蚂蚁金服体验技术部出品
                </Fragment>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );
    // console.log(77777777777777777777777,this.getPageTitle());
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {/* ContainerQuery 在node_modules */}
          {/* 格局大小 */}
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global = {}, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(BasicLayout);
