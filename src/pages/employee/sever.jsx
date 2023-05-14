import { request } from '../../utils/request';

export async function requestFun(query) {
  const res = await request({
    url: '/backend/employee/listIncumbency',
    method: 'post',
    data: query,
  });
  return {
    total: res.total,
    data: res.records,
    success: true,
  };
}

// 停用
export async function disableApi(query) {
  return await request({
    url: `/backend/employee/disable/${query.id}`,
    method: 'post',
  });
}

// 启用
export async function enableApi(query) {
  return await request({
    url: `/backend/employee/enable/${query.id}`,
    method: 'post',
    data: query,
  });
}

// 详情
export async function detailApi(query) {
  return await request({
    url: `/backend/employee/detail/${query.id}`,
    method: 'post',
    data: query,
  });
}

// 积分清零 /backend/employee/clearPoints/{id}
export async function clearPointsApi(query) {
  return await request({
    url: `/backend/employee/clearPoints/${query.id}`,
    method: 'post',
    data: query,
  });
}

// 审核列表
export async function listAuditApi(query) {
  const res = await request({
    url: '/backend/employee/listAudit',
    method: 'post',
    data: query,
  });
  return {
    total: res.total,
    data: res.records,
    success: true,
  };
}
// 审核拒绝
export async function auditRefuseApi(query) {
  return await request({
    url: '/backend/employee/auditReject',
    method: 'post',
    data: query,
  });
}
// 审核通过
export async function auditPassApi(query) {
  return await request({
    url: `/backend/employee/auditPass/${query.id}`,
    method: 'post',
    data: query,
  });
}

// 批量启用
export async function batchEnableApi(query) {
  return await request({
    url: '/backend/employee/batchEnable',
    method: 'post',
    data: query,
  });
}

// 批量停用
export async function batchDisableApi(query) {
  return await request({
    url: '/backend/employee/batchDisable',
    method: 'post',
    data: query,
  });
}

// 批量清零积分 /backend/employee/batchClearPoint
export async function batchClearPointsApi(query) {
  return await request({
    url: '/backend/employee/batchClearPoint',
    method: 'post',
    data: query,
  });
}

// 批量审核通过 /backend/employee/batchAuditPass
export async function batchAuditPassApi(query) {
  return await request({
    url: '/backend/employee/batchAuditPass',
    method: 'post',
    data: query,
  });
}

// 批量审核拒绝 /backend/employee/batchAuditReject
export async function batchAuditRejectApi(query) {
  return await request({
    url: '/backend/employee/batchAuditReject',
    method: 'post',
    data: query,
  });
}
