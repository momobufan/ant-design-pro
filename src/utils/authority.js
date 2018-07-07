// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  return localStorage.getItem('antd-pro-authority') || 'admin';
  //获取指定key本地存储的值
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
  //将authority存储到antd-pro-authority字段
}
