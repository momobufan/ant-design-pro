import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Authorized from './Authorized';

class AuthorizedRoute extends React.Component {
  render() {
    const { component: Component, render, authority, redirectPath, ...rest } = this.props;
    return (
      <Authorized
        authority={authority}
        noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />} //如果没通过权限走这步
      >
        <Route {...rest} render={props => (Component ? <Component {...props} /> : render(props))} />
        {/* 通过了就走这步 */}
      </Authorized>
    );
  }
}

export default AuthorizedRoute;

//在AuthorizedRoute组件中又包含Authorized组件封装。
//Authorized是一个高阶组件，通过调用CheckPermissions方法返回一个新的组件
