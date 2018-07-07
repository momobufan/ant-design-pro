// /userinfo/2144/id => ['/userinfo','/useinfo/2144,'/userindo/2144/id']
export function urlToList(url) {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((urlItem, index) => {
    return `/${urllist.slice(0, index + 1).join('/')}`;
  });
}
//将pathname传入到urlToList方法中，urlToList首先对url用’/’分割，filter方法对空值进行处理（分割后第一个元素为空）。返回一级路径、二级路径…依次类推。例如当前pathname为/A/B时，则返回[‘/A’,’/A/B’]
