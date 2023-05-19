import { request, requestHost } from '../../utils/request';


export async function productListApi(query) {
  const res = await request({
    url: '/backend/product/list',
    method: 'post',
    data: query,
  });
  return {
    total: res.total,
    data: res.records,
    success: true,
  };
}

// 删除产品
export async function deleteApi(query) {
  return await request({
    url: `/backend/product/delete/${query.id}`,
    method: 'post',
    data: query,
  });
}

// 企业动态
export async function entActionListApi(query) {
  const res = await request({
    url: '/backend/entAction/list',
    method: 'post',
    data: query,
  });
  return {
    total: res.total,
    data: res.records,
    success: true,
  };
}
// 删除企业动态
export async function entActionDeleteApi(query) {
  return await request({
    url: `/backend/entAction/delete/${query.id}`,
    method: 'post',
    data: query,
  });
}

// 更新主图
export async function updateMainUrlApi(query) {
  return await request({
    url: '/backend/index/setUrl',
    method: 'post',
    data: query,
  });
}

// 图片上传接口
export async function uploadImgApi(query) {
  const formData = new FormData();
  const boundary = Math.random().toString().substr(2);
  formData.append('file', query);
  return await request({
    url: '/backend/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': `multipart/form-data; boundary=----WebKitFormBoundary${boundary}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
}

// 图片上传api
export const uploadApi = () => {
  const api = '/backend/upload';
  if (process.env.NODE_ENV === 'production') {
    return requestHost + api;
  }
  return api;
};

// 新增产品内容
export async function addProductApi(query) {
  return await request({
    url: '/backend/product/add',
    method: 'post',
    data: query,
  });
}

// 查看产品详情
export async function productDetailApi(query) {
  return await request({
    url: `/backend/product/get/${query.id}`,
    method: 'get',
  });
}

// 编辑产品
export async function editProductApi(query) {
  return await request({
    url: '/backend/product/update',
    method: 'post',
    data: query,
  });
}

// 新增企业动态
export async function addEntActionApi(query) {
  return await request({
    url: '/backend/entAction/add',
    method: 'post',
    data: query,
  });
}

// 查看企业动态详情
export async function entActionDetailApi(query) {
  return await request({
    url: `/backend/entAction/get/${query.id}`,
    method: 'get',
  });
}

// 编辑企业动态
export async function editEntActionApi(query) {
  return await request({
    url: '/backend/entAction/update',
    method: 'post',
    data: query,
  });
}

// 获取首页主图
export async function getMainUrlApi() {
  return await request({
    url: '/backend/index/getUrl',
    method: 'get',
  });
}
