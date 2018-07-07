import Authorized from './Authorized';
import AuthorizedRoute from './AuthorizedRoute';
import Secured from './Secured';
import check from './CheckPermissions.js';
import renderAuthorize from './renderAuthorize';

Authorized.Secured = Secured;
Authorized.AuthorizedRoute = AuthorizedRoute;
Authorized.check = check;

export default renderAuthorize(Authorized);

// 有两个export：1、当前权限值，通过renderAuthorize方法传入当前权限值计算（对应let Authorized = RenderAuthorized(getAuthority())）；2、Authorized组件，有三部分组成，其中有我们的
// AuthorizedRoute组件
