export default {
  formatNumber: function (num) {
    let result = ''
    if (num === undefined) {
      return ''
    } else {
      num = num.toString()
      let numIntStr = ''
      let numFloatStr = ''
      if (num.indexOf('.') > -1) {
        num = num.split('.')
        numIntStr = num[0]
        numFloatStr = num[1]
      } else {
        numIntStr = num
      }
      result = numIntStr.replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,')
      result += numFloatStr ? '.' + numFloatStr : numFloatStr
    }
    return result
  },
  getNowTimes (time, formatStr = 'hhmmss') {
    if (time) {
      let date = new Date(time)
      let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      switch (formatStr) {
        case 'hh':
          return hour
        case 'hhmm':
          return hour + ':' + minute
        case 'hhmmss':
          return hour + ':' + minute + ':' + second
      }
    } else {
      return '-'
    }
  },
  getTime (time, type = 'yyyy-mm-dd') {
    // let oDate = new Date(time)
    // let preDate = oDate.setTime(oDate.getTime() - 24 * 60 * 60 * 1000)
    // console.log(new Date(preDate))
    let getDate = time ? new Date(time) : new Date()
    let getYear = getDate.getFullYear()
    let getMonth = getDate.getMonth() + 1
    if (getMonth < 10) {
      getMonth = '0' + getMonth
    }
    let getDay = getDate.getDate()
    if (getDay < 10) {
      getDay = '0' + getDay
    }
    let getHour = getDate.getHours()
    if (getHour < 10) {
      getHour = '0' + getHour
    }
    let getMinutes = getDate.getMinutes()
    if (getMinutes < 10) {
      getMinutes = '0' + getMinutes
    }
    var getSeconds = getDate.getSeconds()
    if (getSeconds < 10) {
      getSeconds = '0' + getSeconds
    }
    switch (type) {
      case 'yyyy-mm-dd':
        return getYear + '-' + getMonth + '-' + getDay
      case 'yyyy/mm/dd hh:mm':
        return getYear + '/' + getMonth + '/' + getDay + ' ' + getHour + ':' + getMinutes
      case 'yyyy/mm/dd hh:mm:ss':
        return getYear + '/' + getMonth + '/' + getDay + ' ' + getHour + ':' + getMinutes + ':' + getSeconds
      case 'yyyy-mm-dd hh:mm:ss':
        return getYear + '-' + getMonth + '-' + getDay + ' ' + getHour + ':' + getMinutes + ':' + getSeconds
      case 'yyyy.mm.dd':
        return getYear + '.' + getMonth + '.' + getDay
      case 'hh:00:00':
        return getHour + ':' + '00:00'
    }
  },
  // 时间精确到日
  getTimeToDay (time) {
    // let oDate = new Date(time)
    // let preDate = oDate.setTime(oDate.getTime() - 24 * 60 * 60 * 1000)
    // console.log(new Date(preDate))
    if (time) {
      let getDate = new Date(time)
      let getYear = getDate.getFullYear()
      let getMonth = getDate.getMonth() + 1
      if (getMonth < 10) {
        getMonth = '0' + getMonth
      }
      let getDay = getDate.getDate()
      if (getDay < 10) {
        getDay = '0' + getDay
      }
      return getYear + '' + getMonth + '' + getDay
    } else {
      return ''
    }
  },
  // 千分位格式化数据
  formatMoneyWithDesiciontotal (num) {
    return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
  },
  filterStr (str) {
    if (str) {
      if (str.length > 4) {
        return str.slice(0, 4) + '...'
      } else {
        return str
      }
    } else {
      return str
    }
  },
  filterFiveStr (str) {
    if (str) {
      if (str.length > 5) {
        return str.slice(0, 5) + '...'
      } else {
        return str
      }
    } else {
      return str
    }
  },
  changePhone (str) {
    if (str) {
      return str.slice(0, 3) + '****' + str.slice(7)
    } else {
      return str
    }
  },
  changeIdCard (str) {
    if (str) {
      return str.slice(0, 6) + '********' + str.slice(14)
    } else {
      return str
    }
  },
  changeTime (str) {
    if (str) {
      return str.slice(0, 4) + str.slice(5, 7) + str.slice(8)
    }
  },
  changeTime1 (str) {
    if (str) {
      return str.slice(0, 4) + '年' + str.slice(4, 6) + '月' + str.slice(6) + '日'
    }
  },
  changeTime2 (str) {
    if (str) {
      return str.slice(0, 4) + '年' + str.slice(5, 7) + '月' + str.slice(8) + '日'
    }
  },
  changeTimeNew (str, type) {
    if (str) {
      if (type === 'date') {
        let getDate = new Date(str.replace(/-/g, '/'))
        let getYear = getDate.getFullYear()
        let getMonth = getDate.getMonth() + 1
        if (getMonth < 10) {
          getMonth = '0' + getMonth
        }
        let getDay = getDate.getDate()
        if (getDay < 10) {
          getDay = '0' + getDay
        }
        return getYear + '/' + getMonth + '/' + getDay
      } else {
        let getDate = new Date(str)
        let day = getDate.getDay()
        let weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        return weekday[day]
      }
    }
  },
  changeTimes (str) {
    if (str) {
      return str.slice(0, 2) + ':' + str.slice(2)
    }
  },
  changeNum (num) {
    if (num) {
      return (num * 10).toString().indexOf('.') > -1 ? (num * 10).toFixed(1) : (num * 10).toFixed(1)
    }
  },
  // 时间精确到日
  getTimeToDayAndWeek (time) {
    // let oDate = new Date(time)
    // let preDate = oDate.setTime(oDate.getTime() - 24 * 60 * 60 * 1000)
    // console.log(new Date(preDate))
    let getDate = new Date(time)
    let getYear = getDate.getFullYear()
    let getMonth = getDate.getMonth() + 1
    if (getMonth < 10) {
      getMonth = '0' + getMonth
    }
    let getDay = getDate.getDate()
    if (getDay < 10) {
      getDay = '0' + getDay
    }
    let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    let week = getDate.getDay()
    return getYear + '年' + getMonth + '月' + getDay + '日' + ' ' + weekArr[week]
  },
  getDateAndTime (str) {
    if (str) {
      let date = str.slice(0, 4) + str.slice(4, 6) + str.slice(6, 8)
      let time = str.slice(15)
      let time1 = ''
      if (time === '上午') {
        time1 = '1200'
      } else {
        time1 = '0600'
      }
      return {
        date: date,
        time: time1
      }
    }
  },
  changeDate (str, type = 'yyyy年mm月dd日') {
    if (str) {
      switch (type) {
        case 'yyyy年mm月dd日':
          return str.slice(0, 4) + '年' + str.slice(5, 7) + '月' + str.slice(8, 10) + '日'
        case 'yyyy-mm-dd':
          return str.slice(0, 4) + '.' + str.slice(4, 6) + '.' + str.slice(6, 8)
      }
    }
  },
  changeDate1 (str, symbol = '年月日') {
    if (str) {
      switch (symbol) {
        case '.':
          if (str.length === 8) {
            return str.slice(0, 4) + '.' + str.slice(4, 6) + '.' + str.slice(6, 8)
          } else {
            return str.slice(0, 4) + '.' + str.slice(5, 7) + '.' + str.slice(8, 10)
          }
        case '年月日':
          if (str.length === 8) {
            return str.slice(0, 4) + '年' + str.slice(4, 6) + '月' + str.slice(6, 8) + '日'
          } else {
            return str.slice(0, 4) + '年' + str.slice(5, 7) + '月' + str.slice(8, 10) + '日'
          }
      }
    }
  },
  // 姓名加密隐藏第二位
  encryptName (str) {
    if (str) {
      if (str.length >= 2) {
        let strArr = str.split('')
        for (let i = 1; i < strArr.length; i++) {
          strArr[i] = '*'
        }
        if (strArr.length > 5) {
          strArr = strArr.slice(0, 5)
        }
        return strArr.join('')
      } else {
        return str
      }
    }
    return ''
  },
  getDictsType (val, dictsList) {
    for (let i = 0, length = dictsList.length; i < length; i++) {
      if (dictsList[i].dictValue === val) {
        console.log(dictsList[i].dictLabel)
        return dictsList[i].dictLabel
      }
    }
  }
}
