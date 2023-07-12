import { message } from 'antd';
import axios from 'axios';
import { getToken } from './token';

// const requestHost = 'https://www.fastmock.site/mock/750e52b38d306262a62ff61d1858d451/kt';

export const requestHost = 'http://hznanf.com';
// const requestHost = 'http://112.124.2.130:8088';

if (process.env.NODE_ENV === 'production') {
  console.log('NODE_ENV: production');
  axios.defaults.baseURL = requestHost;
}

axios.defaults.timeout = 1000000; // 超时时间设置大一点，防止上传文件超时
axios.defaults.headers.common.Accept = '*/*';
axios.defaults.headers.common['Content-Type'] = 'application/json';
// axios.defaults.headers.post['Content-Type'] = 'application/json';

function fetch({ url, method, data, headers }) {
  // 设置请求头
  axios.defaults.headers.common.Authorization = getToken();

  switch (method) {
    case 'get':
      return axios.get(url, { params: data }, { headers });
    case 'post':
      return axios.post(url, data, { headers });
    case 'put':
      return axios.put(url, data, { headers });
    case 'delete':
      return axios.delete(url, data, { headers });
    default:
      return axios.get(url, { params: data }, { headers });
  }
}

export async function request({ url, method, data, headers }) {
  try {
    const res = await fetch({ url, method, data, headers });

    if (url.endsWith('/backend/upload')) {
      console.log(url, res, 'res');
      const urlHost = 'http://hznfsb.oss-cn-hangzhou.aliyuncs.com/';
      return `${urlHost}${res.data}`;
    }

    if (res.status === 200) {
      if (res.data.code === 200) {
        return res.data.data;
      }
      message.error(res.data.message);
      return Promise.reject(res.data);
    }
    message.error(res.statusText);
    return Promise.reject(res.data);
  } catch (error) {
    if (error.response.status === 401) {
      message.error('登录过期，请重新登录', 1, () => {
        window.location.href = '/login';
      });
      return Promise.reject(error.response);
    }
    message.error(error.response.message);
    return Promise.reject(error.response);
  }
}
