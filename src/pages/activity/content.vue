<template>
  <div class="main h100 ub ub-ver">
    <NavBar :title="title" />
    <div v-if="counts > 0" class="toper" :style="{background: colors[typeIndex]}">
      <div class="ranks ub ub-ac ub-pj">
        <div v-if="counts > 0" class="typeItem">
          <image class="pImg" :src="first.avatar" mode="aspectFill" />
          <div class="pTit" style="margin-left:16rpx">{{ first.nike }}</div>
          <span v-if="typeIndex === 0" class="price" :style="{color: colors[typeIndex]}">￥{{ first.money }}</span>
          <span v-else class="price" :style="{color: colors[typeIndex]}">{{ first.points }}</span>
        </div>
        <div v-if="counts > 1" class="typeItem">
          <image class="pImg" :src="second.avatar" mode="aspectFill" />
          <div class="pTit" style="margin-left:16rpx">{{ second.nike }}</div>
          <span v-if="typeIndex === 0" class="price" :style="{color: colors[typeIndex]}">￥{{ second.money }}</span>
          <span v-else class="price" :style="{color: colors[typeIndex]}">{{ second.points }}</span>
        </div>
        <div v-if="counts > 2" class="typeItem">
          <image class="pImg" :src="third.avatar" mode="aspectFill" />
          <div class="pTit" style="margin-left:16rpx">{{ third.nike }}</div>
          <span v-if="typeIndex === 0" class="price" :style="{color: colors[typeIndex]}">￥{{ third.money }}</span>
          <span v-else class="price" :style="{color: colors[typeIndex]}">{{ third.points }}</span>
        </div>
      </div>
    </div>
    <div v-if="dataList.length > 0" class="content ub-f1">
      <div v-for="(item, index) in dataList" :key="index" class="pItem ub ub-ac bbc">
        <div class="pIndex">{{ index + 1 }}</div>
        <image class="pImg" :src="item.avatar" mode="aspectFill" />
        <div class="pTit ub-f1" style="margin-left:16rpx">{{ item.nike }}</div>
        <span v-if="typeIndex === 0" class="price" style="color:#ff7744">￥{{ item.money }}</span>
        <span v-else class="price" style="color:#ff7744">{{ item.points }}</span>
      </div>
    </div>
    <div v-if="dataList.length === 0 && getedData" class="content ub-f1 ub ub-ver ub-ac ub-pc">
      <image class="nodataImg" src="../../static/null/null3.png" mode="widthFix" />
      <div class="nodataTxt">暂无榜单</div>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
import constant from '@/utils/constant'
import { errDialog, loading, toPage } from '@/utils/util'
export default {
  data() {
    const actType = uni.getStorageSync('actType')
    return {
      curTab: 0,
      title: '',
      dataList: [],
      getedData: false,
      colors: ['#0469F7', '#ff6662'],
      typeIndex: actType,
      counts: 0,
      first: {},
      second: {},
      third: {}
    }
  },
  onLoad() {
    this.getData(this.typeIndex)
  },
  onShow() {
    this.title = ['用户消费榜', '赛事积分榜'][this.typeIndex]
  },
  methods: {
    getData(type) {
      let url = '/api/account/topAccountRecord'
      if (type == 1) { url = '/api/userPoints/list' }
      service.get(`${url}?params[pageNum]=1&params[pageSize]=50`).then(res => {
        this.getedData = true
        this.dataList = type === 1 ? (res.data || []) : (res.data.list || [])
        this.dataList.forEach(it => {
          if (it.nike && it.nike.length > 2) { it.nike = it.nike.charAt(0) + '...' + it.nike.charAt(it.nike.length - 1) }
        })
        this.counts = this.dataList.length
        if (this.counts > 0) { this.first = this.dataList[0] }
        if (this.counts > 1) { this.second = this.dataList[1] }
        if (this.counts > 2) { this.third = this.dataList[2] }
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
  height: 100%;
}
.toper {
  padding: 40rpx 40rpx 60rpx;
  position: relative;
}
.actbg {
  display: block;
  width: 750rpx;
  height: 360rpx;
  position: absolute;
  left: 0;
  z-index: 0;
}
.ranks{
  padding:10rpx 10rpx 30rpx;
  background:#fff;
  width: 660rpx;
  border-radius: 12rpx;
  margin: 0 auto;
}
.typeItem{
  width: 224rpx;
  height: 200rpx;
  border-radius: 6rpx;
  text-align: center;
  color: #fff;
  font-size: 32rpx;
  padding: 20rpx;
}
.content{
  border-radius: 16rpx 16rpx 0 0;
  background: #ffffff;
  overflow: hidden;
  margin-top: -30rpx;
  position: relative;
  z-index: 1;
  padding: 30rpx 30rpx 100rpx;
  box-sizing: border-box;
}
.icon_menu{width: 80rpx;height: 80rpx;}
.menuTit{ margin-top: 16rpx;  font-size: 26rpx;}
.pItem{padding-bottom:10rpx; margin-bottom: 24rpx;background: #fff;border-radius: 12rpx;}
.pImg{width: 90rpx; height:90rpx;border-radius:58rpx;margin-left: 20rpx;}
.pTit{font-size: 28rpx;color: #333;padding-left:10rpx;font-weight: bold;}
.price{font-size: 28rpx;color: #ff7744;font-weight: bold;padding-left:10rpx}
.count{font-size: 28rpx;color: #ccc;margin-bottom: 16rpx;padding-left:10rpx}
.price span{font-size: 24rpx;color: #ccc;margin-left:10rpx;text-decoration: line-through;}
.icon_ctrl{width: 36rpx; height: 36rpx;margin-right:6rpx;}
.num_ctrl{font-size:28rpx;color: #333;margin-right:20rpx;}
</style>
