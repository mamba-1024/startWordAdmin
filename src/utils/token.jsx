
// 保存token
export function saveToken(token) {
  localStorage.setItem('token', token);
}

// 获取token
export function getToken() {
  return localStorage.getItem('token');
}

// 删除token
export function removeToken() {
  localStorage.removeItem('token');
}
