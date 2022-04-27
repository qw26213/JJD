<template>
  <div class="main">
    <NavBar title="活动" transpent="1" />
    <div class="toper" :style="'padding-top:'+ (paddingTop + 20) + 'rpx'">
      <image src="../../static/actbg.jpg" class="actbg" mode="aspectFill" :style="'height:'+ (paddingTop + 270) + 'rpx'" />
      <div class="ub ub-ac ub-pj1 plr10">
        <div class="actItem" style="" @click.stop="toPageByParam('/pages/activity/content', 0)">
          <image class="actImg" src="../../static/act1.png">
            <span class="z99">用户消费榜</span>
          </image></div>
        <div class="actItem" style="margin-left:19rpx;" @click.stop="toPageByParam('/pages/activity/content', 1)">
          <image class="actImg" src="../../static/act2.png">
            <span class="z99">赛事积分榜</span>
          </image></div>
      </div>
    </div>
    <div class="content">
      <div class="tabs ub ub-ac">
        <div v-for="(item,index) in tabList" :key="index" class="item ub ub-ver ub-ac" :class="{'on': curTab===index}" @click="swtichTab(index,item.id)">
          <div class="txt tx-c">{{ item.name }}</div>
          <div class="line" />
        </div>
      </div>
      <div class="plr15">
        <div v-for="(item, index) in dataList" :key="index" class="pItem ub ub-ac" @click.stop="toDetail(item.id)">
          <image class="pImg" :src="item.image" mode="aspectFill" />
          <div class="ub-f1" style="margin-left:16rpx">
            <div class="pTit">{{ item.title }}</div>
            <div class="ub ub-ac">
              <image src="../../static/icon_ctrl1.png" class="icon_ctrl" />
              <span class="num_ctrl">{{ item.likes }}</span>
              <image src="../../static/icon_ctrl2.png" class="icon_ctrl" />
              <span class="num_ctrl">{{ item.comments }}</span>
              <image src="../../static/icon_ctrl3.png" class="icon_ctrl" />
              <span class="num_ctrl">{{ item.collects }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
import { toPage, getStorageStore } from '@/utils/util'
export default {
  data() {
    return {
      paddingTop: 50,
      curTab: 0,
      tabList: [],
      userInfo: {},
      userIcon: '',
      dataList: []
    }
  },
  onShow() {
    // #ifdef MP-WEIXIN || APP-PLUS
    const MenuButton = uni.getMenuButtonBoundingClientRect()
    this.paddingTop = (MenuButton.top + MenuButton.height + 20) * 2
    // #endif
    this.getData()
  },
  onLoad(options) {
    if (options.share) {
      uni.setStorageSync('storeShare', 1)
    }
    if (options.storeId) {
      uni.setStorageSync('storeId', options.storeId)
    }
    if (options.storeName) {
      uni.setStorageSync('storeName', options.storeName)
    }
    uni.setStorageSync('shopTab', 0)
  },
  onShareAppMessage() {
    const store = getStorageStore()
    return {
      title: store.name,
      path: `/pages/shopset/index?share=1&storeId=` + store.id + '&storeName=' + store.name
    }
  },
  methods: {
    getData() {
      service.get('/api/article/categories/dict').then(res => {
        console.log(res.data)
        this.tabList = res.data || []
        if (this.tabList.length > 0) {
          this.getList(this.tabList[0].id, 1)
        }
      })
    },
    getList(cid, pindex) {
      service.get(`/api/article/release/page?categoryId=${cid}&params[pageNum]=${pindex}&params[pageSize]=10`).then(res => {
        this.dataList = res.data.list || []
      })
    },
    toPageByParam(url, type) {
      uni.setStorageSync('actType', type)
      toPage(url)
    },
    swtichTab(index, cid) {
      this.curTab = index
      this.getList(cid, 1)
    },
    toDetail(id) {
      toPage('/pages/activity/detail?id=' + id)
    }
  }
}
</script>
<style scoped>
.main{width: 100%;box-sizing: border-box;position: absolute;top: 0;left: 0;}
.toper {
  height: 200rpx;
  position: relative;
  box-sizing: content-box;
}
.actbg {
  display: block;
  width: 750rpx;
  height: 500rpx;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.actItem{width: 336rpx; height: 210rpx;border-radius: 6rpx;text-align: center; color: #fff;font-size: 32rpx;padding: 15rpx;position: relative;}
.actImg{
  width: 336rpx;
  height: 210rpx;
  position: absolute;
  top: 0;
  left: 0;
}
.content{
  width: 100%;
  border-radius: 20rpx 20rpx 0 0;
  background: #ffffff;
  overflow: hidden;
  position: relative;
  z-index: 1;
  margin-top: 30rpx;
}

.tabs{width: 710rpx;height: 80rpx;background: #fff;margin: 14rpx auto 20rpx;}
.tabs .item{width: 150rpx;}
.tabs .item .txt{font-size:28rpx;font-weight: bold;color: #333;}
.tabs .item .line{width:80rpx;height: 6rpx;background: #3387ff;margin-top:6rpx;opacity: 0;}
.tabs .item.on .txt{font-size:28rpx;color: #3387ff;}
.tabs .item.on .line{opacity: 1;}
.icon_menu{width: 80rpx;height: 80rpx;}
.menuTit{ margin-top: 16rpx; font-size: 26rpx; }
.pItem{width: 710rpx;padding-bottom:10rpx; margin-bottom: 24rpx;background: #fff;border-radius: 12rpx;}
.pImg{width: 220rpx; height:160rpx;border-radius: 12rpx;}
.pTit{font-size: 28rpx;color: #333;padding-left:10rpx;font-weight: bold;height: 120rpx;}
.price{font-size: 28rpx;color: #ff7744;font-weight: bold;padding-left:10rpx}
.count{font-size: 28rpx;color: #ccc;margin-bottom: 16rpx;padding-left:10rpx}
.price span{font-size: 24rpx;color: #ccc;margin-left:10rpx;text-decoration: line-through;}
.icon_ctrl{width: 32rpx; height: 32rpx;margin-right:8rpx;}
.num_ctrl{font-size:24rpx;color: #999;margin-right:20rpx;}
</style>
