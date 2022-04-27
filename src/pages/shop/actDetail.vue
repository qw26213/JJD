<template>
  <view class="main">
    <NavBar title="活动详情" />
    <div class="toper">
      <div style="font-size:32rpx; font-weight:bold">{{ article.actTitle }}</div>
      <div class="ub ub-ac" style="font-size:24rpx;margin-top:10rpx">
        <image src="../../static/icon_time.png" class="udb" style="width:32rpx;height:32rpx;margin-right:10rpx;color:#666" />
        {{ article.createTime }}
      </div>
    </div>
    <div class="content">
      <image class="udb w_100 aImg" :src="article.actPic" />
      <div class="tit ub ub-ac">
        <image class="titImg" src="../../static/icon_tit.png" mode="asceptFill" />活动介绍
      </div>
      <div class="tx-l txt">{{ article.actDescript }}</div>
      <div class="tx-l txt mt10">活动时间：{{ article.actBeginDate }} 至 {{ article.actEndDate }}</div>
      <div class="actGoods">
        <div class="tit ub ub-ac">
          <image class="titImg" src="../../static/icon_tit.png" mode="asceptFill" />限定商品
        </div>
        <div v-for="(item, index) in goodList" :key="index" class="pItem ub ub-ac" @click="toDetail(item.id, 5)">
          <image class="pImg" :src="item.pImg" mode="aspectFill" />
          <div class="ub-f1" style="margin-left:20rpx">
            <div class="pTit">{{ item.name }}</div>
            <div class="price">
              ￥{{ item.price }}
              <span>￥{{ item.linePrice }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="tit ub ub-ac">
        <image class="titImg" src="../../static/icon_tit.png" mode="asceptFill" />活动规则
      </div>
      <div v-for="(item,index) in article.actRules" :key="index" class="tx-l txt" style="line-height:48rpx">{{ item }}</div>
    </div>
  </view>
</template>
<script>
import service from '@/utils/http'
import { loading, toPage } from '@/utils/util'

export default {
  data() {
    return {
      curTab: 0,
      article: {},
      goodList: []
    }
  },
  onLoad(options) {
    this.id = options.id
    this.getArticle()
  },
  methods: {
    bindInput(e) {
      this.content = e.detail.value
    },
    toDetail(id, type) {
      toPage('/pages/shop/detail?id=' + id + '&type=' + type)
    },
    getArticle() {
      const id = this.id
      service.get(`/api/sass/activity/detail/${id}`).then(res => {
        this.article = res.data
        this.article.actRules = this.article.actRules.split('\r\n\r\n')
        const ids = this.article.actGoodsId.split(',')
        this.getGoods(ids)
      })
    },
    getGoods(ids) {
      this.goodList = []
      ids.forEach(id => {
        service.get(`/api/goods/detail/${id}`).then(res => {
          this.goodList.push(res.data)
          this.goodList.forEach(it => {
            it.pImg = it.pic.split(',')[0]
          })
        })
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
  background: #f7f7f7;
}
.toper {
  width: 100%;
  padding: 20rpx;
  background: #ffffff;
}

.aImg{border-radius: 12rpx;}
.citem{height: 180rpx;background-color: #fff;}
.content {
  border-radius: 16rpx 16rpx 0 0;
  background: #ffffff;
  overflow: hidden;
  margin-top: 20rpx;
  position: relative;
  z-index: 1;
  padding: 30rpx;
  box-sizing: border-box;
}

.tit{
  height: 72rpx;
  font-size: 26rpx;
  line-height: 72rpx;
  position: relative;
  font-weight: bold;
}
.titImg{width: 41rpx;height: 41rpx;margin-right: 10rpx;}

.txt{
  font-size: 24rpx;
}
.actGoods{border-top:1rpx #f1f1f1 solid;border-bottom:1rpx #e6e6e6 solid;margin-top:20rpx}
.pItem{width: 710rpx;margin-bottom:10rpx; margin-bottom: 24rpx;background: #fff;border-radius: 12rpx;}
.pImg{width: 155rpx; height:155rpx;border-radius: 12rpx;border: 1rpx #e5e5e5 solid;}
.pTit{font-size: 24rpx;color: #333;font-weight: bold;height: 60rpx;}
.price{font-size: 24rpx;color: #ff7744;font-weight: bold;}
.price span{font-size: 24rpx;color: #ccc;margin-left:10rpx;text-decoration: line-through;}
</style>
