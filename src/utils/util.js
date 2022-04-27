const formatTime = () => {
    var date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function _rad(d) {
    return d * Math.PI / 180.0
}
function wxGetCode() {
    return new Promise((ps, pe) => {
        uni.login({
            success(res) {
                ps(res.code)
            },
            fail() { pe() }
        })
    })
}

function getDistance(pos1, pos2) {
    const that = this
    const radLat1 = _rad(pos1[1])
    const radLat2 = _rad(pos2[1])
    const a = radLat1 - radLat2
    const b = _rad(pos1[0]) - _rad(pos2[0])
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000 // 输出为公里
    return s * 1000
}

function loading() {
    uni.showToast({
        title: '加载中',
        icon: 'loading',
        mask: true
    })
}

function errDialog(content) {
    uni.hideLoading()
    uni.showModal({
        title: '温馨提示',
        content: `${content}`,
        showCancel: false,
        confirmColor: '#5499FF'
    })
}

function toPage(url) {
    uni.navigateTo({
        url
    })
}

function checkMobile(tel) {
    var mobile = /^1[23456789]\d{9}$/
    return mobile.test(tel)
}

function checkEmail(str) {
    var reg = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/
    return reg.test(str)
}

function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'deepClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}
// 按钮防抖
function debounce(fn, wait) {
    var timeout = null
    return function () {
        if (timeout !== null) { clearTimeout(timeout) }
        timeout = setTimeout(fn, wait)
    }
}

/** 获取路径参数**/
function getUrlParma(url, name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = url.substr(url.indexOf('\?') + 1).match(reg)
    if (r != null) return unescape(r[2])
    return null
}

// 根据时间戳格式化日期
function formatDate() {
    var time = new Date()
    var y = time.getFullYear()
    var m = time.getMonth() + 1
    var d = time.getDate()
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
}

function delBlank(value) {
    return String(value).replace(/(^\s*)|(\s*$)/g, '')
}

function getStorageStore() {
    return {
        id: uni.getStorageSync('storeId'),
        name: uni.getStorageSync('storeName')
    }
}

/**
 * 转换富文本的图片最大为100%
 * 转换行内样式的双引号问题
 */
function formatRichText(html) {
    // 去掉img标签里的style、width、height属性
    let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
        match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
        match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '')
        match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '')
        return match
    })
    // 修改所有style里的width属性为max-width:100%
    newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
        match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;')
        return match
    })
    // 去掉<br/>标签
    newContent = newContent.replace(/<br[^>]*\/>/gi, '')
    // img标签添加style属性：max-width:100%;height:auto
    newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin:0px auto;"')
    return newContent
}

module.exports = {
    wxGetCode,
    formatTime,
    loading,
    errDialog,
    getUrlParma,
    checkMobile,
    checkEmail,
    delBlank,
    formatDate,
    deepClone,
    getDistance,
    debounce,
    toPage,
    formatRichText,
    getStorageStore
}
