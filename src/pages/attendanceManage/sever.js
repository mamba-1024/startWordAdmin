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

// 导出记录
export async function exportApi(query) {
  const res = await request({
    url: '/backend/employee/export/oss',
    method: 'post',
    data: query,
  });
  return res;
}
