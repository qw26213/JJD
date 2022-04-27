<template>
  <div class="main">
    <NavBar title="点赞" />
    <div class="content plr10">
      <div v-for="(item, index) in dataList" :key="index" class="pItem ub ub-ac" @click.stop="toPage('/pages/shop/store?id='+item.id)">
        <image class="pImg" :src="item.pic" mode="aspectFill" />
        <div class="ub-f1" style="margin-left:16rpx">
          <div class="pTit">{{ item.name }}</div>
          <div class="price">
            ￥{{ item.price }}
            <span>￥{{ item.linePrice }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
import constant from '@/utils/constant'
import { errDialog, loading, toPage } from '@/utils/util'
export default {
  data() {
    return {
      curTab: 0,
      dataList: [],
      toPage
    }
  },
  onReady() {
    this.getData()
  },
  methods: {
    getData() {
      service.get('/api/userGoods/list').then(res => {
        this.dataList = res.data.list || []
      })
      // service.get('/api/userLikes/list').then(res => {
      //   this.dataList = res.data.list || []
      // })
    },
    toPageByParam(url, type) {
      uni.setStorageSync('actType', type)
      toPage(url)
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
  height: 100%;
}
.content{
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  margin-top: 20rpx;
  padding-top: 20rpx;
  position: relative;
  z-index: 1;
}
.pItem{width: 710rpx; padding-bottom: 20rpx;background: #fff;border-radius: 12rpx;}
.pItem:last-child{margin-bottom: 0;}
.pImg{width: 160rpx; height:160rpx;border-radius:12rpx;border:1rpx #eee solid;box-sizing: border-box;}

.pTit{font-size: 28rpx;color: #333;padding-left:10rpx;font-weight: bold;height: 120rpx;}
.price{font-size: 28rpx;color: #ff7744;font-weight: bold;padding-left:10rpx}
.count{font-size: 28rpx;color: #ccc;margin-bottom: 16rpx;padding-left:10rpx}
.price span{font-size: 24rpx;color: #ccc;margin-left:10rpx;text-decoration: line-through;}
.icon_ctrl{width: 36rpx; height: 36rpx;margin-right:6rpx;}
.num_ctrl{font-size:28rpx;color: #333;margin-right:20rpx;}
</style>
