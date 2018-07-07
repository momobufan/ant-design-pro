import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  // console.log(app._models)
  !app._models.some(({ namespace }) => {
    // console.log(app);
    // console.log(model);
    // console.log(model.substring(model.lastIndexOf('/') + 1))
    //则将从字符串的最后一个字符处开始检索
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });
// some() 方法用于检测数组中的元素是否满足指定条件（函数提供）。
// some() 方法会依次执行数组的每个元素：
// 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
// 如果没有满足条件的元素，则返回false。
// 注意： some() 不会对空数组进行检测。
// 注意： some() 不会改变原始数组
// substring() 方法用于提取字符串中介于两个指定下标之间的字符。

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  // console.log(component.toString());
  if (component.toString().indexOf('.then(') < 0) {
    //执行这步是为了什么
    // 如果要检索的字符串值没有出现，则该方法返回 -1
    console.log('mmmmmmmm', models);
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default); //?
      }
    });

    console.log('qqqqq', models);

    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')

  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    //过滤
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        // console.log(12258525555)
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

// menuData经过getMenuData()处理之后，path已经变成了完整的相对路径，
// getFlatMenuData主要是对getMenuData()的数据做处理。有如下使用方式，
// getFlatMenuData有两个作用：
// 1. 将getMenuData()的结果（Array）转换成以path为key的对象数据（Object）；
// 2. 通过递归调用，将getMenuData()的结果的父子层级结构的数据处理为平行数据。

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      //假如存在子级
      keys[item.path] = { ...item }; //path做key
      keys = { ...keys, ...getFlatMenuData(item.children) }; // 把子集里每一个各自path
    } else {
      keys[item.path] = { ...item };
    }
  });
  // console.log(keys)
  //  /dashboard:
  // authority:undefined
  // children:Array(3)
  //     0:{name: "分析页", path: "/dashboard/analysis", authority: undefined}
  //     1:{name: "监控页", path: "/dashboard/monitor", authority: undefined}
  //     2:{name: "工作台", path: "/dashboard/workplace", authority: undefined}
  //     length:3
  //     __proto__:Array(0)
  // icon:"dashboard"
  // name:"dashboard"
  // path:"/dashboard"
  // __proto__:Object
  //  /dashboard/analysis:{name: "分析页", path: "/dashboard/analysis", authority: undefined}
  //  /dashboard/monitor:{name: "监控页", path: "/dashboard/monitor", authority: undefined}
  //  /dashboard/workplace:{name: "工作台", path: "/dashboard/workplace", authority: undefined}
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
        import('../routes/Dashboard/Workplace')
      ),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
    },
    '/form/basic-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    },
    '/form/step-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    },
    '/form/step-form/info': {
      name: '分步表单（填写转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
      name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      name: '分步表单（完成）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    '/list/table-list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    },
    '/list/basic-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/card-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    },
    '/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/profile/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    },
    '/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/AdvancedProfile')
      ),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path); //
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    // key
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
      // console.log(menuItem); //依据每个key都可以找到对应的数据
      // {name: "标准列表", path: "/list/basic-list", authority: undefined}
    }
    let router = routerConfig[path];
    //console.log(router);// component:f(props)
    // console.log(router.component)

    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router, //component:f(props)
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    // console.log(path)
    routerData[path] = router;
    // 以上目的为了让每个路由都有component:f(props),name,authority,hideInBreadcrumb
  });
  // console.log('ppppp',routerData);
  return routerData;
};

// 处理后的menuData是以path为key的Object，其中value为对应的菜单项配置。其中routerConfig为项目的路由配置，具体参看源代码。

//   循环遍历routerConfig：
// 1. 当路由的path能在menuData中找到匹配（即菜单项对应的路由），则获取菜单项中当前path的配置menuItem；
// 2. 获取当前path的路由配置router；
// 3. 返回最新路由信息，name、authority、hideInBreadcrumb三个属性如果router中没有配置，则取菜单项中的配置
