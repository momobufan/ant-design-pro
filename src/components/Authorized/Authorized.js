import React from 'react';
import CheckPermissions from './CheckPermissions';

class Authorized extends React.Component {
  render() {
    const { children, authority, noMatch = null } = this.props;
    const childrenRender = typeof children === 'undefined' ? null : children;
    //现有权限和准入权限比对
    //CheckPermissions返回childrenRender或者noMatch
    return CheckPermissions(authority, childrenRender, noMatch);
  }
}

export default Authorized;

// ../components/Authorized中有两个export：1、当前权限值，通过renderAuthorize方法传入当前权限值计算（对应let Authorized = RenderAuthorized(getAuthority())）；2、Authorized组件，有三部分组成，其中有我们的
// AuthorizedRoute组件
