import { request } from '../../utils/request';
import axios from 'axios';


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


export async function exportApi(query) {
  try {
    const response = await axios.post('/backend/employee/export', query, {
      responseType: 'blob', // 设置响应数据类型为 Blob
    });

    // 从响应中获取文件名
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
        ? contentDisposition.split(';')[1].trim().split('=')[1]
        : 'exported_file';

    // 创建下载链接并触发下载
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出文件失败', error);
  }
}


export async function exportDailyApi(query) {
  try {
    const response = await axios.post('/backend/attendance/export/daily', query, {
      responseType: 'blob', // 设置响应数据类型为 Blob
    });

    // 从响应中获取文件名
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
        ? contentDisposition.split(';')[1].trim().split('=')[1]
        : 'exported_file';

    // 创建下载链接并触发下载
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出文件失败', error);
  }
}


export async function exportMonthApi(query) {
  try {
    const response = await axios.post('/backend/attendance/export/month', query, {
      responseType: 'blob', // 设置响应数据类型为 Blob
    });

    // 从响应中获取文件名
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
        ? contentDisposition.split(';')[1].trim().split('=')[1]
        : 'exported_file';

    // 创建下载链接并触发下载
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出文件失败', error);
  }
}