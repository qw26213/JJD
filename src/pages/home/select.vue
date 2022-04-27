<template>
  <div class="main ub ub-ver">
    <NavBar title="选择门店" transpent="1" />
    <div class="toper" :style="'padding-top:'+ (paddingTop) + 'px'">
      <image src="../../static/bg.jpg" class="mybg" mode="aspectFill" :style="'height:'+ (paddingTop + 150) + 'px'" />
      <div class="banner">
        <image src="../../static/ttt.png" style="width:710rpx;height:200rpx;border-radius: 8rpx;" mode="asceptFill" />
      </div>
    </div>
    <div class="tabs ub ub-ac">
      <div v-for="(item, index) in ['精选网咖', '历史上机']" :key="index" class="item ub ub-ver ub-ac" :class="{'on': curTab===index}" @click.stop="curTab=index">
        <div class="txt tx-c">{{ item }}</div>
        <div class="line" />
      </div>
    </div>
    <div v-show="curTab === 0" class="content ub-f1">
      <div v-for="(item, index) in dataList1" :key="index" class="sItem ub ub-ac" @click.stop="selectStore(item.id, item.name)">
        <image class="sImg" src="../../static/bbb.png" mode="aspectFill" />
        <div class="ub-f1">
          <div class="sTit">{{ item.name }}</div>
          <div class="sTxt">地址: {{ item.address }}</div>
        </div>
        <span class="dist">{{ item.distance | numFormat }}公里</span>
        <image class="arrow-right" src="../../static/arrow-right.png" mode="widthFix" />
      </div>
    </div>
    <div v-show="curTab === 1" class="content ub-f1">
      <div v-for="(item, index) in dataList2" :key="index" class="sItem ub ub-ac" @click.stop="selectStore(item.id, item.name)">
        <image class="sImg" src="../../static/bbb.png" mode="aspectFill" />
        <div class="ub-f1">
          <div class="sTit">{{ item.name }}</div>
          <div class="sTxt">地址: {{ item.address }}</div>
        </div>
        <span class="dist">{{ item.distance | numFormat }}公里</span>
        <image class="arrow-right" src="../../static/arrow-right.png" mode="widthFix" />
      </div>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
import { reverseGeocoder } from '@/utils/locationUtil'
export default {
  filters: {
    numFormat(num) {
      return Number(num).toFixed(2)
    }
  },
  data() {
    return {
      paddingTop: 50,
      curTab: 0,
      city: '',
      dataList1: [],
      dataList2: []
    }
  },
  onShow() {
    // #ifdef MP-WEIXIN || APP-PLUS
    const MenuButton = uni.getMenuButtonBoundingClientRect()
    this.paddingTop = MenuButton.top + MenuButton.height
    // #endif
  },
  onLoad() {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.getCityByLocation(res.latitude, res.longitude)
      },
      fail: () => {
        console.log('error')
      }
    })
  },
  methods: {
    async getCityByLocation(latitude, longitude) {
      const ret = await reverseGeocoder(latitude, longitude)
      if (!ret) return
      const { address_component } = ret
      const { city } = address_component
      this.getData(latitude, longitude, city)
    },
    selectStore(id, name) {
      uni.removeStorageSync('car')
      uni.setStorageSync('storeId', id)
      uni.setStorageSync('storeName', name)
      uni.reLaunch({
        url: '/pages/home/index'
      })
    },
    getData(latitude, longitude, city) {
      const obj = {
        latitude,
        longitude,
        city
      }
      service.get('/api/public/getStore', obj).then(res => {
        this.dataList1 = res.data || []
      })
      service.get('/api/public/getUserStoreInfo', obj).then(res => {
        this.dataList2 = res.data || []
      })
    }
  }
}

</script>
<style scoped>
.main{width: 100%; height: 100%;}
.toper{ width: 100%; height: 290rpx;box-sizing: content-box;overflow: hidden;}
.tabs{width: 100%;height: 80rpx;margin: -40rpx auto 0;border-radius: 16rpx 16rpx 0 0; background: #fff; padding: 20rpx;}
.tabs .item{width: 140rpx;margin-right:40rpx}
.tabs .item .txt{font-size:28rpx;font-weight: bold;color: #666;}
.tabs .item .line{width:40rpx;height: 6rpx;background: #0099ff;margin-top:6rpx;opacity: 0;}
.tabs .item.on .txt{font-size:28rpx;color: #0099ff;}
.tabs .item.on .line{opacity: 1;}
.mybg { display: block; width: 750rpx; height: 540rpx; position: absolute; left: 0; top: 0; z-index: 0;}
.banner{ padding: 20rpx 20rpx;position: relative; z-index: 2; }

.content {overflow: auto;padding: 0 24rpx;background: #fff;}
.citem { height: 80rpx; background: #fff; line-height: 80rpx; border-bottom: 1rpx #eee solid;}
.citem .txt{ font-size: 28rpx; }
.sItem{padding-bottom: 20rpx;padding-top: 20rpx; border-bottom: 1rpx #e5e5e5 solid;}
.sItem:last-child{border-bottom: none;}
.sImg{width: 110rpx; height:110rpx;border-radius:12rpx;border:1rpx #eee solid;box-sizing: border-box;}
.sTit{font-size: 26rpx;color: #333;padding-left:10rpx;}
.sTxt{font-size: 24rpx;color: #666;padding-left:10rpx;margin-top: 12rpx;}
.dist{font-size: 20rpx; color: #999;}
.arrow-right{width: 20rpx;height: 40rpx;}
</style>
