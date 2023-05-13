import { request } from '../../utils/request';


export async function attendanceListApi(query) {
  const res = await request({
    url: '/backend/attendance/list',
    method: 'post',
    data: query,
  });
  return {
    total: res.total,
    data: res.records,
    success: true,
  };
}
