import request from '@/utils/request'

// 查询合同详情
export function contractDetail(contractId) {
  return request({
    url: `/hbics/admin/contract/detail/${contractId}`,
    method: 'get'
  })
}

// 字典
export function treeType(dictType) {
  return request({
    url: `/system/dict/data/treeType/${dictType}`,
    method: 'get'
  })
}

// 获取dToken
export function dToken ()  {
  return request({
    url: '/auth/dToken',
    method: 'get',
  });
};
