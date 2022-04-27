<template>
  <view class="main">
    <NavBar title="用户登录" transpent="1" />
    <image src="../../static/lt.jpg" class="ltbg" mode="asceptFill" />
    <image src="../../static/lb.jpg" class="lbbg" mode="widthFix" />
    <div class="ub ub-ver ub-ac plr30 z99" style="padding-top:350rpx">
      <button type="primary" class="btnLogin" @click="handleUserInfo">微信快捷登录</button>
      <button class="btnCancel" plain="true" @click="backPage">取消登录</button>
    </div>
  </view>
</template>
<script>
import service from '@/utils/http'
import constant from '@/utils/constant'
import { errDialog, wxGetCode, loading } from '@/utils/util'
export default {
  data() {
    return {
      isLogining: false,
      type: ''
    }
  },
  onLoad(options) {
    this.type = options.type
  },
  methods: {
    backPage: function() {
      uni.navigateBack()
    },
    handleUserInfo() {
      uni.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
          this.updateInfo(res)
        }
      })
      uni.getUserInfo({
        success: (res) => {
        },
        fail: () => {
          console.log('未授权')
        }
      })
    },
    async updateInfo(res) {
      const code = await wxGetCode()
      const data = {
        encryptDataB64: res.encryptedData,
        ivB64: res.iv,
        code: code,
        nick: res.userInfo.nickName,
        icon: res.userInfo.avatarUrl
      }
      service.post('/api/login/wxLogin', data).then(res => {
        uni.setStorageSync('Access-Token', res.data.token)
        this.backPage()
      })
    }
  }
}
</script>

<style>
.main{height: 100%;}
.ltbg {
  display: block;
  width: 750rpx;
  height: 500rpx;
  position: absolute;
  top: 0;
  left: 0;
}
.lbbg {
  display: block;
  width: 750rpx;
  height: 150rpx;
  position: absolute;
  bottom: 0;
  left: 0;
}

.btnLogin {
  border-radius: 50rpx;
  width: 100%;
  height: 84rpx;
  color: #fff;
  font-size: 28rpx;
  line-height: 84rpx;
  padding: 0;
  margin-top: 200rpx;
  text-align: center;
}

.btnLogin.disabled {
  background: #a7b6ea;
}

.btnCancel {
  border-radius: 50rpx;
  width: 100%;
  height: 84rpx;
  color: #999999;
  font-size: 28rpx;
  line-height: 84rpx;
  padding: 0;
  border-color: #ccc !important;
  margin-top: 40rpx;
  text-align: center;
}
</style>
