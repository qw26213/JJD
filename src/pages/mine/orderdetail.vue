<template>
  <div class="main">
    <NavBar :title="title" transpent="1" />
    <div class="toper" :style="'padding-top:'+ (paddingTop) + 'px'">
      <image src="../../static/bg.jpg" class="mybg" mode="aspectFill" :style="'height:'+ (paddingTop + 120) + 'px'" />
      <div v-if="title === '订单详情'" class="topTxt1 z99 plr30">{{ detailInfo.status | statusFormat }}</div>
      <!-- <div v-if="title === '确认订单'" class="topTxt1 z99 plr30">{{detailInfo.logisticsType | typeFormat}}</div> -->
      <div v-if="title === '订单详情'" class="topTxt2 z99 plr30">{{ detailInfo.logisticsType | typeFormat }}</div>
    </div>
    <div class="content">
      <div class="tit">商品清单</div>
      <div class="pList p10">
        <div v-for="(it, ii) in detailInfo.subOrders" :key="ii" class="uitem ub ub-ac">
          <image v-if="detailInfo.type === 4" class="pImg" src="../../static/bbb.png" mode="aspectFill" />
          <image v-else class="pImg" :src="it.proUrl" mode="aspectFill" />
          <div style="margin-left:20rpx">
            <div class="pTit">{{ it.name }}</div>
            <div v-if="it.spDataJson" class="pTxt">{{ it.spDataJson[0].attrVal }}</div>
            <div class="pTxt" style="margin-top:20rpx">*{{ it.count }}</div>
          </div>
          <div class="total">￥{{ it.total }}</div>
        </div>
      </div>
    </div>
    <div class="content" style="margin-top:16rpx;padding-top:0">
      <div class="tit">订单信息</div>
      <div>
        <div class="itemTxt">订单号: {{ detailInfo.orderNo }}</div>
        <div class="itemTxt">下单时间: {{ detailInfo.createTime }}</div>
        <div class="itemTxt">支付方式: {{ detailInfo.payType == 2 ? '微信支付' : '其它' }}</div>
        <div class="itemTxt">购物数量: {{ counts }}份</div>
        <div class="itemTxt">预计送达：1小时内</div>
      </div>
    </div>
    <div class="ub ub-ac ub-pe bottom plr15">
      <div v-if="detailInfo.status==7 || detailInfo.status == 8 || detailInfo.status == 9" class="btn1 btnc2 ub ub-ac ub-pc" @click.stop="toDelete()">删除订单</div>
      <div v-if="detailInfo.status==1" class="btn1 btnc1 ub ub-ac ub-pc" @click.stop="toCancel()">取消订单</div>
      <div v-if="detailInfo.status==1" class="btn1 btnc2 ub ub-ac ub-pc" style="margin-left:30rpx" @click.stop="toPay()">立即支付</div>
      <div v-if="(detailInfo.status==4 || detailInfo.status == 2 || detailInfo.status==3 || detailInfo.status == 5) && detailInfo.type!=2" class="btn1 btnc2 ub ub-ac ub-pc" style="margin-left:30rpx" @click.stop="toNotice()">催单</div>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
import constant from '@/utils/constant'
import { errDialog, loading } from '@/utils/util'
var orderStatusMap = {
  '1': '待付款',
  '2': '待使用',
  '3': '待使用',
  '4': '待使用',
  '5': '待入住',
  '6': '已入住',
  '7': '已完成',
  '8': '已取消',
  '9': '已拒单',
  '0': '其他',
  '10': '挂单'
}
var ebookingOrderStatusMap = {
  '1': '待付款',
  '2': '待使用',
  '3': '待入住',
  '4': '待入住',
  '5': '待入住',
  '6': '已入住',
  '7': '已完成',
  '8': '已取消',
  '9': '已拒单',
  '0': '其他',
  '10': '挂单'
}
var typeMap = {
  '1': '自提',
  '2': '外送',
  '3': '店送'
}
export default {
  filters: {
    statusFormat(status) {
      const sts = status || 0
      return ebookingOrderStatusMap[sts]
    },
    ostatusFormat(status) {
      const sts = status || 0
      return ebookingOrderStatusMap[sts]
    },
    typeFormat(type) {
      const sts = type || 0
      return typeMap[sts]
    }
  },
  data() {
    return {
      title: '订单详情',
      id: '',
      counts: 0,
      paddingTop: 50,
      detailInfo: {}
    }
  },
  onShow() {
    // #ifdef MP-WEIXIN || APP-PLUS
    const MenuButton = uni.getMenuButtonBoundingClientRect()
    this.paddingTop = MenuButton.top + MenuButton.height
    // #endif
  },
  onLoad(options) {
    // this.title = options.id ? '订单详情' : '确认订单'
    this.id = options.id || options.scene
    this.getData()
  },
  methods: {
    getData() {
      const id = this.id
      service.get('/api/order/detail/' + id).then(res => {
        this.detailInfo = res.data || {}
        let count = 0
        this.detailInfo.subOrders.forEach(it => {
          it.total = it.price * it.count
          count += it.count
        })
        this.counts = count
      })
    },
    toNotice() {
      const id = this.id
      service.get(`/api/order/detail/${id}`).then(res => {
        uni.showToast({
          title: '催单成功',
          icon: 'success'
        })
        this.getData()
      })
    },
    toCancel() {
      const id = this.id
      wx.showModal({
        title: '温馨提示',
        content: '确定要取消该订单吗？',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            service.get('/api/order/cancelOrder/' + id).then(res => {
              uni.showToast({
                title: '取消订单成功',
                icon: 'success'
              })
              this.getData()
            })
          }
        }
      })
    },
    toDelete() {
      const id = this.id
      wx.showModal({
        title: '温馨提示',
        content: '确定要删除该订单吗？',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            service.get('/api/order/deleteOrder/' + id).then(res => {
              uni.showToast({
                title: '删除订单成功',
                icon: 'success'
              })
              uni.navigateBack()
            })
          }
        }
      })
    },
    toPay() {
      const obj = { orderNo: this.id, payType: 2 }
      service.post('/api/order/appPay', obj).then(res => {
        uni.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.packageValue,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(res) {
            uni.navigateTo({
              url: '/pages/mine/orders?key=2&backLen=2'
            })
          },
          fail(res) {
            console.error(res)
          }
        })
      })
    }
  }
}
</script>
<style scoped>
.toper{  width: 100%;   height: 170rpx;   background: #0469F7;   box-sizing: content-box;}
.mybg { display: block; width: 750rpx; height: 540rpx; position: absolute; left: 0; top: 0; z-index: 0;}

.content {
  margin-top: -50rpx; width: 750rpx; box-sizing: border-box; border-radius: 20rpx 20rpx 0 0; padding: 10rpx 20rpx 0; position: relative; z-index: 567;
  background: #fff;
}
.tit{
  height: 80rpx;border-bottom: 1rpx #eee solid;
  padding-left: 20rpx;font-size: 28rpx;line-height: 80rpx;
  position: relative;
  padding-left: 18rpx;
  font-weight: bold;
}
.tit:before{
  content: ''; width: 8rpx; height: 32rpx; background: #0099ff; position: absolute; left: 0rpx; top: 26rpx;
}
.itemTxt{
  height: 80rpx;;padding-left: 20rpx;font-size: 26rpx;line-height: 70rpx;
}
.pImg{
  width: 120rpx; height: 120rpx; border-radius: 8rpx;
}
.pTit{
  font-size: 28rpx;color:#333
}
.pTxt{
  font-size: 24rpx;color:#999
}
.btn1 {
    width: 144rpx; height: 56rpx; font-size: 24rpx;
}
.btnc1{
    color: #666; border-radius: 56rpx; border: #eee solid 1rpx;
}
.btn2 {
    width: 78rpx;  height: 64rpx;  font-size: 24rpx;
}
.btnc2{
    color: #fff; border-radius: 64rpx; background: #ff6662;
}
.bottom{position: fixed; bottom: 0;left:0;width: 100%;height: 88rpx;background: #fff;z-index: 11; border-top: 1rpx #e5e5e5 solid;}
.total{
  position: absolute;
  bottom: 0rpx;
  right: 0rpx;
  font-size: 24rpx;
  color:#fe5864
}
.topTxt1{
  font-size:32rpx;
  color:#fff
}
.topTxt2{
  font-size:24rpx;
  color:#eee;
  margin-top:10rpx
}

</style>
