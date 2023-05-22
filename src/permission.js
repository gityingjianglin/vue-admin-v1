import router from './router'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { checkUserCenterLogin, outLogin} from '@/utils/userCenter'
import config from '@/config/config'
import store from './store'

NProgress.configure({ showSpinner: false })

const whiteList = ['/401']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.name === '401' && to.query.code) {
    next({
      path: '/'
    })
    NProgress.done()
  }
  if (getToken()) {
    // token存在可直接访问
    console.log(store.getters.roles.length)
    if (store.getters.roles.length === 0) {
      store.dispatch('GetInfo').then(() => {
        store.dispatch('GenerateRoutes').then(accessRoutes => {
          debugger
          // let isBreak = false
          // for (let i = 0, length = accessRoutes.length; i < length; i++) {
          //   if (isBreak) {
          //     break
          //   }
          //   let childRenList = accessRoutes[i].children
          //   for (let j = 0, length1 = childRenList.length; j < length1; j++) {
          //     if (childRenList[j].path === 'appointmentManagement') {
          //       childRenList.push({
          //         path: 'appointmentManagement/edit',
          //         component: () => import('@/views/appointmentManagement/edit'),
          //         name: 'Index',
          //         meta: { title: '编辑', icon: 'dashboard', affix: true, activeMenu: "/appointmentManagement", }
          //       })
          //       isBreak = true
          //       break
          //     }
          //   }
          // }
          accessRoutes.forEach((item) => {
            item.children
          })
          // 根据roles权限生成可访问的路由表
          router.addRoutes(accessRoutes) // 动态添加可访问路由表
          next({ ...to, replace: true })
        }).catch(err => {
          Message.error(err)
          outLogin()
        })
      })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else if (config.openUserCenter) {
      // 账户中心对接开启，进行集团账户对接
      checkUserCenterLogin().then(() => {
        store.dispatch('GetInfo').then(() => {
          store.dispatch('GenerateRoutes').then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            // let isBreak = false
            // for (let i = 0, length = accessRoutes.length; i < length; i++) {
            //   if (isBreak) {
            //     break
            //   }
            //   let childRenList = accessRoutes[i].children
            //   for (let j = 0, length1 = childRenList.length; j < length1; j++) {
            //     if (childRenList[j].path === 'appointmentManagement') {
            //       childRenList.push({
            //         path: 'appointmentManagement/edit',
            //         component: () => import('@/views/appointmentManagement/edit'),
            //         name: 'Index',
            //         meta: { title: '编辑', icon: 'dashboard', affix: true }
            //       })
            //       isBreak = true
            //       break
            //     }
            //   }
            // }
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            console.log(to.path)
            next({ ...to, replace: true })
          })
        }).catch(err => {
          Message.error(err)
          outLogin()
        })
      }, () => {
        next({
          path: '/401'
        })
      })
    } else {
      next()
    }
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
})
router.afterEach(() => {
  NProgress.done()
})
