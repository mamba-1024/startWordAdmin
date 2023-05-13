
// 保存token
export function saveToken(token) {
  localStorage.setItem('TOKEN', token);
}

// 获取token
export function getToken() {
  return localStorage.getItem('TOKEN');
}

// 删除token
export function removeToken() {
  localStorage.removeItem('TOKEN');
}
