<template>
  <div class="main">
    <NavBar :title="store.name" />
    <view class="view_head" @click="toSearch">
      <view class="view_head_search plr20">
        <div style="color:#aaa;font-size:28rpx" class="ub-f1">搜索您想要的商品</div>
        <image src="../../static/search.png" />
      </view>
    </view>
    <image v-for="(item, index) in imgList" :key="index" class="homePage" :src="item" mode="widthFix" />
    <!-- <div class="utabs ub ub-ac">
      <div v-for="(item,index) in ['店铺首页', '店铺分类']" :key="index" class="item ub-f1 ub ub-ver ub-ac" :class="{'on': curTab===index}" @click="curTab=index">
        <div class="txt tx-c">{{ item }}</div>
        <div class="line"></div>
      </div>
    </div>
    <div class="content plr10">
      <div v-for="(item, index) in dataList" :key="index" class="pItem ub ub-ac">
        <image class="pImg" src="../../static/bbb.png" mode="aspectFill" />
        <div class="ub-f1">
          <div class="pTit">英雄联盟游戏机</div>
          <div class="count">销量：50</div>
          <div class="price">
            ￥100.00
            <span>￥200.00</span>
          </div>
        </div>
      </div>
    </div>-->
  </div>
</template>
<script>
import service from '@/utils/http'
import { errDialog, loading, toPage } from '@/utils/util'
export default {
  data() {
    return {
      curTab: 0,
      store: {},
      imgList: []
    }
  },
  onLoad(options) {
    this.getData(options.id)
  },
  methods: {
    toSearch(e) {
      toPage('/pages/shop/search')
    },
    getData(id) {
      service.get('/api/public/getStoreInfo?storeId=' + id).then(res => {
        this.store = res.data
        this.imgList = res.data.homePage ? res.data.homePage.split(',') : ''
      })
    },
    swtichTab(index) {
      this.curTab = index
    }
  }
}
</script>
<style scoped>
.main {
  position: relative;
  width: 100%;
  background: #fff;
  padding-bottom: 20rpx;
}
.view_head {
  background-color: white;
  padding: 20rpx 24rpx;
}

.view_head .view_head_search {
  height: 80rpx;
  background-color: #F8F8F8;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
}

.view_head .view_head_search image {
  width: 36rpx;
  height: 36rpx;
}
.icon_menu{width: 80rpx;height: 80rpx;}
.menuTit{
  margin-top: 16rpx;
  font-size: 26rpx;
}
.content {
  padding: 20rpx 20rpx 100rpx;
  background: #f7f7f7;
}
.homePage{width: 710rpx;margin: 0 auto;display: block;}
.pItem{width: 710rpx; margin-bottom: 24rpx;background: #fff;border-radius: 12rpx;}
.pImg{width: 155rpx; height:155rpx;border-radius: 0 0 8rpx 8rpx;}
.pTit{font-size: 28rpx;color: #333;padding-left:10rpx;font-weight: bold;}
.price{font-size: 28rpx;color: #ff7744;font-weight: bold;padding-left:10rpx}
.count{font-size: 28rpx;color: #ccc;margin-bottom: 16rpx;padding-left:10rpx}
.price span{font-size: 24rpx;color: #ccc;margin-left:10rpx;text-decoration: line-through;}
</style>
