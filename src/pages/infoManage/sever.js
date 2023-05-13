import { request } from '../../utils/request';


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
