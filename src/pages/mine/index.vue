<template>
  <div class="main">
    <NavBar title="我的" transpent="1" />
    <div class="toper ub ub-ac" :style="'padding-top:'+ (paddingTop + 30) + 'px'">
      <image src="../../static/my.jpg" class="mybg" mode="scaleToFill" :style="'height:'+ (paddingTop + 150) + 'px'" />
      <div v-if="isLogin" class="userDiv">
        <image type="userAvatarUrl" :src="userInfo.icon" class="userImg udb" />
      </div>
      <div v-else class="userDiv">
        <image src="../../static/user.png" class="userImg udb" mode="aspectFit" />
      </div>
      <div v-if="isLogin" class="ub-f1 ub ub-ver" style="margin-left:10rpx">
        <text class="txt" style="font-size:32rpx">{{ userInfo.nike }}</text>
      </div>
      <div v-else class="ub-f1 loginTxt z99" @click.stop="toLogin">登录</div>
      <div v-if="isLogin" class="rightbtn" @click="toPage('/pages/mine/mycenter?id='+userId)">个人主页</div>
      <image v-else class="arrow-right z99" style="margin-right:30rpx" src="../../static/arrow-right1.png" />
    </div>
    <div class="menus ub ub-ac ub-pj">
      <div class="ub-f1 ub-ver ub ub-ac ub-pc" @click.stop="toPage('/pages/mine/cart')">
        <image src="../../static/icon_mine1.png" class="icon_menu" mode="aspectFit" />
        <div class="menuTit">购物车</div>
      </div>
      <div class="ub-f1 ub-ver ub ub-ac ub-pc" @click.stop="toPage('/pages/mine/orders?type=1')">
        <image src="../../static/icon_mine2.png" class="icon_menu" mode="aspectFit" />
        <div class="menuTit">待付款</div>
        <div v-if="staticData.waitCount > 0" class="dot">{{ staticData.waitCount }}</div>
      </div>
      <div class="ub-f1 ub-ver ub ub-ac ub-pc" @click.stop="toPage('/pages/mine/orders?type=2')">
        <image src="../../static/icon_mine3.png" class="icon_menu" mode="aspectFit" />
        <div class="menuTit">待使用</div>
        <div v-if="staticData.waitUse > 0" class="dot">{{ staticData.waitUse }}</div>
      </div>
      <div class="ub-f1 ub-ver ub ub-ac ub-pc" @click.stop="toPage('/pages/mine/orders?type=3')">
        <image src="../../static/icon_mine4.png" class="icon_menu" mode="aspectFit" />
        <div class="menuTit">已完成</div>
      </div>
      <div class="ub-f1 ub-ver ub ub-ac ub-pc" @click.stop="toPage('/pages/mine/orders?type=0')">
        <image src="../../static/icon_mine5.png" class="icon_menu" mode="aspectFit" />
        <div class="menuTit">全部订单</div>
      </div>
    </div>
    <div class="arrows plr20">
      <div class="item ub ub-ac bbc" @click.stop="jumpPoints">
        <image src="../../static/icon_mine6.png" class="icon_cell" mode="aspectFit" />
        <div class="ub-f1 itemTit">我的积分</div>
        <image src="../../static/arrow-right.png" class="arrow-right" />
      </div>
      <div class="item ub ub-ac bbc" @click.stop="jumpAuth">
        <image src="../../static/icon_mine7.png" class="icon_cell" mode="aspectFit" />
        <div class="ub-f1 itemTit">实名认证</div>
        <span v-if="isAuth" style="font-size:24rpx">已实名</span>
        <image src="../../static/arrow-right.png" class="arrow-right" />
      </div>
      <button class="item ub ub-ac kefu" open-type="contact" :session-from="storeId">
        <image src="../../static/icon_mine8.png" class="icon_cell" mode="aspectFit" />
        <div class="ub-f1 itemTit">咨询商户</div>
        <image src="../../static/arrow-right.png" class="arrow-right" />
      </button>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
import constant from '@/utils/constant'
import { errDialog, loading, toPage } from '@/utils/util'
export default {
  data() {
    const token = uni.getStorageSync('Access-Token')
    return {
      storeId: uni.getStorageSync('storeId'),
      isLogin: !!token,
      paddingTop: 50,
      address: '',
      isAuth: false,
      userInfo: {},
      staticData: {},
      userId: '',
      toPage
    }
  },
  onShow() {
    const token = uni.getStorageSync('Access-Token')
    this.isLogin = !!token
    // #ifdef MP-WEIXIN || APP-PLUS
    const MenuButton = uni.getMenuButtonBoundingClientRect()
    this.paddingTop = MenuButton.top + MenuButton.height
    // #endif
    this.getData()
  },
  onLoad() {
    uni.setStorageSync('shopTab', 0)
  },
  methods: {
    toLogin() {
      toPage('/pages/login/index')
    },
    jumpAuth() {
      if (!this.isAuth) {
        toPage('/pages/mine/certify')
      }
    },
    jumpPoints() {
      toPage('/pages/mine/points')
    },
    getData() {
      service.get('/api/order/staticData').then(res => {
        this.staticData = res.data
      })
      service.get('/api/identification/info').then(res => {
        this.userInfo = res.data
        this.isLogin = !!res.data.icon
        this.isAuth = res.data && res.data.status === 1
      })
      service.get('/api/account/getInfo').then(res => {
        this.userId = res.data && res.data.userId
      })
    }
  }
}
</script>
<style scoped>
.main {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
}
.main > div {
  position: relative;
  z-index: 1;
}
.mybg {
  display: block;
  width: 750rpx;
  height: 540rpx;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
}
.toper {
  height: 260rpx;
  padding-bottom: 20rpx;
  position: relative;
  padding-left: 30rpx;
}
.rightbtn {
  width: 145rpx;
  height: 60rpx;
  line-height: 60rpx;
  padding-left: 24rpx;
  border-radius: 60rpx 0 0 60rpx;
  background-color: rgba(255, 255, 255, 0.3);
  font-size: 26rpx;
  color: #fff;
  z-index: 8000;
}
.toper .txt {
  color: #fff;
  font-size: 24rpx;
}
.userDiv {
  border: 1rpx #fff solid;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  overflow: hidden;
  padding: 0;
  margin-right: 18rpx;
  position: relative;
}
.userImg {
  width: 120rpx;
  height: 120rpx;
}

.kefu{
  padding: 0;background: transparent;
}

.kefu::after {
  border: 0;
}

.headImg {
  width: 130rpx;
  height: 130rpx;
  border-radius: 100rpx;
  margin-right: 30rpx;
  background-color: #fff;
  border: 4rpx #fff solid;
}

.menus{width: 710rpx;height: 180rpx;background: #fff;margin: 60rpx auto 30rpx; border-radius: 12rpx;box-shadow: 0 8rpx 6rpx 0 rgba(102, 102, 102, 0.3);}

.arrows{margin-top:20rpx}

.arrows .item{background: #fff;height: 96rpx;}

.menuTit{
  margin-top: 16rpx;
  font-size: 26rpx;
}
.itemTit{font-size: 28rpx;text-align: left;}
.icon_menu{width: 64rpx;height: 64rpx;}
.icon_cell{width: 48rpx;height: 48rpx;margin-right:20rpx}
.loginTxt{font-size: 32rpx;position: relative; color: #eee;margin-left:10rpx;height: 100rpx;line-height: 100rpx;}
.z99{z-index: 99;}
.dot{width: 40rpx;height: 40rpx;border-radius: 26rpx;background: #fe5864;position: absolute;top: 0; right: 10rpx;text-align: center;line-height: 40rpx; color: #fff;}
</style>
