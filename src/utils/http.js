import constant from '@/utils/constant'
import { errDialog } from '@/utils/util'
const service = {
	request: function (method, url, data) {
		const headers = {
			'content-type': 'application/json',
			'Store-ID': uni.getStorageSync("storeId")
		}
		// #ifdef H5 || APP-PLUS
		const token = uni.getStorageSync("Access-Token") || '142592066872934477-bdf76087-21dc-4871-ad78-2d7edddf956f'
		// #endif

		// #ifdef MP-WEIXIN
		const token = uni.getStorageSync("Access-Token")
		// #endif

		if (token) {
			headers.token = token
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				header: headers,
				data: data,
				method: method,
				dataType: 'json',
				success: function (res) {
					uni.hideLoading()
					if (res.data.code === '00000') {
						resolve(res.data)
					} else if (res.data.code === 'B0001' && res.data.msg === '没有token' && (method === 'POST' || method === 'PUT')) {
						uni.showToast({
							icon: 'none',
							duration: 1000,
							title: '请先登录'
						})
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/login/index'
							})
						}, 1200)
					} else {
						if (res.data.msg !== '没有token')
							errDialog(res.data.msg)
					}
				},
				fail: function (err) {
					uni.hideLoading()
					reject(err)
				}
			})
		})
	},
	get: function (url, data) {
		let allurl = this.geturl(url)
		return this.request('GET', allurl, data)
	},
	post: function (url, data) {
		let allurl = this.geturl(url)
		return this.request('POST', allurl, data)
	},
	put: function (url, data) {
		let allurl = this.geturl(url)
		return this.request('PUT', allurl, data)
	},
	geturl: function (url) {
		return constant.apiUrl + url
	}
}

module.exports = service
