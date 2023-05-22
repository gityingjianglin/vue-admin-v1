import request from '@/utils/request'

// 查询部门列表
export function listOrg(query) {
  return request({
    url: '/system/org/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
export function listOrgExcludeChild(deptId) {
  return request({
    url: '/system/org/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getOrg(deptId) {
  return request({
    url: '/system/org/' + deptId,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/system/org/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleOrgTreeselect(roleId) {
  return request({
    url: '/system/org/roleOrgTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addOrg(data) {
  return request({
    url: '/system/org',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateOrg(data) {
  return request({
    url: '/system/org',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delOrg(deptId) {
  return request({
    url: '/system/org/' + deptId,
    method: 'delete'
  })
}

// 点击新增/修改按钮，显示组织名称
export function userOrgTreeselect(params) {
  return request({
    url: '/system/org/userOrgTreeselect',
    method: 'get',
    params: params
  })
}

// 新增组织人员/修改组织人员
export function dataScope(params) {
  return request({
    url: '/system/org/dataScope',
    method: 'post',
    data: params
  })
}

// 所属组织
export function userOrgs(params) {
  return request({
    url: '/system/org/userOrgs',
    method: 'get',
    params: params
  })
}