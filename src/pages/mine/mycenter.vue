<template>
  <view class="main">
    <NavBar title="个人主页" transpent="1" />
    <div class="toper ub ub-ac plr20" :style="'padding-top:'+ (paddingTop + 70) + 'px'">
      <image src="../../static/bg.jpg" class="mybg" mode="widthFix" />
      <div class="userDiv" style="z-index:90">
        <open-data type="userAvatarUrl" class="userImg udb" />
      </div>
      <div class="ub-f1 userInfo" style="z-index:90">
        <open-data type="userNickName" style="font-size:32rpx" />
      </div>
      <!-- <div class="numDiv" style="z-index:90" @click="toPage('/pages/mine/zan')">
        <div class="tx-c" style="font-size:28rpx;font-weight:bold;">{{ userInfo.likes }}</div>
        <div class="tx-c" style="font-size:24rpx;">点赞</div>
      </div>-->
      <div class="numDiv" style="z-index:90" @click="toPage('/pages/mine/collect')">
        <div class="tx-c" style="font-size:28rpx;font-weight:bold;">{{ userInfo.collects }}</div>
        <div class="tx-c" style="font-size:24rpx;">收藏</div>
      </div>
    </div>
    <div v-show="dataList.length > 0" class="content">
      <div v-for="(item, index) in dataList" :key="index" class="pItem ub ub-ac bbc">
        <div class="pIndex">{{ index }}</div>
        <image class="pImg" src="../../static/food.png" mode="aspectFill" />
        <div class="pTit ub-f1" style="margin-left:16rpx">蓝魔电竞高配置酒店，让我们燥起来吧</div>
        <span class="price" style="color:#ff7744">￥999.00</span>
      </div>
    </div>
  </view>
</template>
<script>
import service from '@/utils/http'
import constant from '@/utils/constant'
import { errDialog, loading, toPage } from '@/utils/util'
export default {
  data() {
    return {
      paddingTop: 50,
      mobile: '100',
      userInfo: {},
      dataList: [],
      address: '100',
      toPage
    }
  },
  onShow() {
    // #ifdef MP-WEIXIN || APP-PLUS
    const MenuButton = uni.getMenuButtonBoundingClientRect()
    this.paddingTop = MenuButton.top + MenuButton.height
    // #endif
  },
  onLoad(options) {
    this.getData(options.id)
  },
  methods: {
    getData(id) {
      service.get('/api/communityUser/detail/' + id).then(res => {
        this.userInfo = res.data
      })
      service.get('/api/userAlbum/list?userId=' + id).then(res => {
        this.dataList = res.data.list
      })
    }
  }
}
</script>
<style>
.main{width: 100%;box-sizing: border-box;position: absolute;top: 0;left: 0;}
.toper{height: 230rpx;padding-bottom: 40rpx;width: 100%;}
.mybg {
  display: block;
  width: 750rpx;
  height: 640rpx;
  position: absolute;
  top: 0;
  left: 0;
}

.userInfo{
  color: #fff;
}
.userDiv {
  border: 1rpx #fff solid; width: 120rpx; height: 120rpx; border-radius: 50%; overflow: hidden; padding: 0;
  margin-right: 18rpx; position: relative;
}

.userImg {
  width: 120rpx; height: 120rpx;
}

.headImg {
  width: 130rpx; height: 130rpx; border-radius: 100rpx; margin-right: 30rpx; background-color: #fff; border: 4rpx #fff solid;
}

.numDiv{width: 80rpx;margin-left: 24rpx; font-size:24rpx;}
.numDiv .tx-c{color: #fff;}
.content{
  border-radius: 16rpx 16rpx 0 0; background: #ffffff; overflow: hidden; margin-top: -30rpx; position: relative;
  z-index: 1; padding: 30rpx 30rpx 100rpx; box-sizing: border-box;
}
.pItem{padding-bottom:10rpx; margin-bottom: 24rpx;background: #fff;border-radius: 12rpx;}
.pImg{width: 90rpx; height:90rpx;border-radius:58rpx;margin-left: 20rpx;}
.pTit{font-size: 28rpx;color: #333;padding-left:10rpx;font-weight: bold;}
.price{font-size: 28rpx;color: #ff7744;font-weight: bold;padding-left:10rpx}
.count{font-size: 28rpx;color: #ccc;margin-bottom: 16rpx;padding-left:10rpx}
.price span{font-size: 24rpx;color: #ccc;margin-left:10rpx;text-decoration: line-through;}
.icon_ctrl{width: 36rpx; height: 36rpx;margin-right:6rpx;}
.num_ctrl{font-size:28rpx;color: #333;margin-right:20rpx;}
</style>
