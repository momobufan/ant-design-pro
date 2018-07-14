import RenderAuthorized from '../components/Authorized';
import { getAuthority } from './authority';

let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line  //调方法，看不懂封装的
// console.log(77777,Authorized);
// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority()); //不懂
};
// console.log(55555555555,reloadAuthorized);
export { reloadAuthorized };
export default Authorized;

//AuthorizedRoute是Authorized组件的一个属性。在../utils/Authorized.js中。
//其中getAuthority()获取用户存放在localStorage的权限记录。Authorized是由RenderAuthorized(getAuthority())生成

{
  /* <AuthorizedRoute
path="/"
render={props => <BasicLayout {...props} />}
authority={['admin', 'user']}
redirectPath={getQueryPath('/user/login', {
  redirect: window.location.href,
})} 
/> */
}
