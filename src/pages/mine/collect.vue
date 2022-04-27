<template>
  <div class="main ub ub-ver">
    <NavBar title="我的收藏" />
    <div class="utabs ub ub-ac">
      <div v-for="(item,index) in ['商品收藏', '文章收藏']" :key="index" class="item ub-f1 ub ub-ver ub-ac" :class="{'on': curTab===index}" @click="curTab=index">
        <div class="txt tx-c">{{ item }}</div>
        <div class="line" />
      </div>
    </div>

    <div v-if="curTab == 0 && dataList0.length > 0" class="content" style="padding-top:20rpx">
      <div v-for="(item, index) in dataList0" :key="index" class="pItem ub ub-ac" @click.stop="toPage('/pages/shop/detail?id='+item.id)">
        <image class="pImg" :src="item.pImg" mode="aspectFill" />
        <div class="ub-f1" style="margin-left:16rpx">
          <div class="pTit">{{ item.name }}</div>
          <div class="price">
            ￥{{ item.price }}
            <span>￥{{ item.linePrice }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="curTab == 1 && dataList1.length > 0" class="content" style="padding-top:20rpx">
      <div v-for="(item, index) in dataList1" :key="index" class="pItem ub ub-ac" @click.stop="toPage('/pages/activity/detail?id='+item.articleId)">
        <image class="pImg" :src="item.image" mode="aspectFill" />
        <div class="ub-f1" style="margin-left:16rpx">
          <div class="pTit">{{ item.title }}</div>
        </div>
      </div>
    </div>
    <div v-if="curTab == 2 && dataList2.length > 0" class="content">
      <div v-for="(item, index) in dataList2" :key="index" class="sItem ub ub-ac">
        <image class="sImg" src="../../static/bbb.png" mode="aspectFill" />
        <div class="sTit ub-f1">{{ item.name }}</div>
        <div class="entry" @click.stop="toPage('/pages/shop/store?id='+item.id)">进店逛逛</div>
      </div>
    </div>
    <div v-if="(dataList0.length === 0 && curTab==0) || (dataList1.length === 0 && curTab==1) || (dataList3.length === 0 && curTab==2)" class="content ub-f1 ub ub-ver ub-ac ub-pc">
      <image class="nodataImg" src="../../static/null/null3.png" mode="widthFix" />
      <div class="nodataTxt">暂无收藏</div>
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
      dataList0: [],
      dataList1: [],
      dataList2: [],
      toPage
    }
  },
  onReady() {
    this.getData()
  },
  methods: {
    getData() {
      service.get('/api/userGoods/list').then(res => {
        this.dataList0 = res.data.list || []
        this.dataList0.forEach(it => {
          it.pImg = it.pic.split(',')[0]
        })
      })
      service.get('/api/userCollects/list').then(res => {
        this.dataList1 = res.data.list || []
      })
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
  border-radius: 16rpx 16rpx 0 0;
  background: #ffffff;
  overflow: hidden;
  position: relative;
  z-index: 1;
  padding: 0 20rpx;
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
.sItem{padding-bottom: 20rpx;padding-top: 20rpx; border-bottom: 1rpx #e5e5e5 solid;}
.sItem:last-child{border-bottom: none;}
.sImg{width: 80rpx; height:80rpx;border-radius:12rpx;border:1rpx #eee solid;box-sizing: border-box;}
.sTit{font-size: 28rpx;color: #333;padding-left:10rpx;font-weight: bold;}
.entry{width: 140rpx;height: 56rpx;border:1rpx #e5e5e5 solid;border-radius: 8rpx;font-size: 24rpx;line-height: 56rpx;text-align: center;}
</style>
