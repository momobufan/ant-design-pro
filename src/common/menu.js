import { isUrl } from '../utils/utils'; //引入isUrl方法

const menuData = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '分析页',
        path: 'analysis',
        // children:[
        //   {
        //     name:'好开心',
        //     path:'monitor'
        //   }
        // ]
      },
      {
        name: '监控页',
        path: 'monitor',
      },
      {
        name: '工作台',
        path: 'workplace',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
  {
    name: '表单页',
    icon: 'form',
    path: 'form',
    children: [
      {
        name: '基础表单',
        path: 'basic-form',
      },
      {
        name: '分步表单',
        path: 'step-form',
      },
      {
        name: '高级表单',
        authority: 'admin',
        path: 'advanced-form',
      },
    ],
  },
  {
    name: '列表页',
    icon: 'table',
    path: 'list',
    children: [
      {
        name: '查询表格',
        path: 'table-list',
      },
      {
        name: '标准列表',
        path: 'basic-list',
      },
      {
        name: '卡片列表',
        path: 'card-list',
      },
      {
        name: '搜索列表',
        path: 'search',
        children: [
          {
            name: '搜索列表（文章）',
            path: 'articles',
          },
          {
            name: '搜索列表（项目）',
            path: 'projects',
          },
          {
            name: '搜索列表（应用）',
            path: 'applications',
          },
        ],
      },
    ],
  },
  {
    name: '详情页',
    icon: 'profile',
    path: 'profile',
    children: [
      {
        name: '基础详情页',
        path: 'basic',
      },
      {
        name: '高级详情页',
        path: 'advanced',
        authority: 'admin',
      },
    ],
  },
  {
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
    children: [
      {
        name: '成功',
        path: 'success',
      },
      {
        name: '失败',
        path: 'fail',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  // 如果path不是含有http的链接，即将path设置为完整的相对路径（即父菜单的路径 + 子菜单的路径），并获取当前菜单的权限，
  // 如果没有权限值，则继承父菜单的权限。其他相关属性（name、hideInMenu等）保持不变
  return data.map(item => {
    // console.log()
    let { path } = item;
    // console.log(path)
    if (!isUrl(path)) {
      // console.log(item.path);
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      //为了item.children如果存在children就调用回调函数
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
    //把所有关于path拼接好
  });
}

// console.log(formatter(menuData));
// authority:undefined
// children:Array(3)
// 0:{name: "基础表单", path: "/form/basic-form", authority: undefined},
// 1:{name: "分步表单", path: "/form/step-form", authority: undefined},
// 2:{name: "高级表单", authority: "admin", path: "/form/advanced-form"}
// length:3
// __proto__:Array(0)
// icon:"form"
// name:"表单页"
// path:"/form"
// __proto__:Objec

export const getMenuData = () => formatter(menuData);
