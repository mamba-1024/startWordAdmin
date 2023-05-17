import { request } from '../../utils/request';


// 首页数据
export async function queryHomeData() {
  return await request({
    url: '/backend/index/static',
    method: 'get',
  });
}
