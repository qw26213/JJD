<template>
  <div class="main ub ub-ver">
    <NavBar title="订单" transpent="1" />
    <div class="toper" :style="'padding-top:'+ (paddingTop) + 'px'">
      <image src="../../static/bg.jpg" class="mybg" mode="aspectFill" :style="'height:'+ (paddingTop + 120) + 'px'" />
      <div class="tabs ub ub-ac">
        <div v-for="(item,index) in tabList" :key="index" class="item ub-f1 ub ub-ver ub-ac" :class="{'on': curTab==index}" @click="switchTab(index, item.id)">
          <div class="txt tx-c">{{ item.name }}</div>
          <div class="line" />
        </div>
      </div>
    </div>
    <div v-if="dataList.length > 0" class="content ub-f1">
      <div v-for="(item, index) in dataList" :key="index" class="ritem" @click.stop="toDetail(item.id)">
        <div class="ub ub-pj">
          <div class="number">订单号: {{ item.orderNo }}</div>
          <div class="status">{{ item.status | statusFormat }}</div>
        </div>
        <div class="ub ub-ac pList">
          <div v-for="(it, ii) in item.subOrders" :key="ii" class="uitem">
            <image v-if="item.type === 4" class="pImg" src="../../static/bbb.png" mode="aspectFill" />
            <image v-else class="pImg" :src="it.proUrl" mode="aspectFill" />
            <div class="tx-c pTxt">{{ it.name }}</div>
          </div>
        </div>
        <div class="ub ub-ac mt10">
          <div class="ub-f1" style="font-size:24rpx;color:#666">{{ item.createTime }}</div>
          <div v-if="item.status==7 || item.status == 8 || item.status == 9" class="btn1 btnc2 ub ub-ac ub-pc" @click.stop="toDelete(item.id)">删除订单</div>
          <div v-if="item.status==1" class="btn1 btnc1 ub ub-ac ub-pc" @click.stop="toCancel(item.id)">取消订单</div>
          <div v-if="item.status==1" class="btn1 btnc2 ub ub-ac ub-pc" style="margin-left:30rpx" @click.stop="toPay(item.id)">立即支付</div>
          <div v-if="(item.status==4 || item.status == 2 || item.status==3 || item.status == 5) && item.type!=2" class="btn1 btnc2 ub ub-ac ub-pc" style="margin-left:30rpx" @click.stop="toNotice(item.id)">催单</div>
        </div>
      </div>
    </div>
    <div v-if="dataList.length === 0 && getedData" class="content ub-f1 ub ub-ver ub-ac ub-pc">
      <image class="nodataImg" src="../../static/null/null3.png" mode="widthFix" />
      <div class="nodataTxt">暂无订单</div>
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

export default {
  filters: {
    statusFormat(status) {
      const sts = status || 0
      return ebookingOrderStatusMap[sts]
    },
    ostatusFormat(status) {
      const sts = status || 0
      return ebookingOrderStatusMap[sts]
    }
  },
  data() {
    return {
      paddingTop: 50,
      curTab: 0,
      tabList: [{
        name: '全部',
        id: ''
      }, {
        name: '待付款',
        id: '1'
      }, {
        name: '待使用',
        id: '2,3,4,5'
      }, {
        name: '已完成',
        id: '7'
      }],
      dataList: [],
      getedData: false
    }
  },
  onShow() {
    // #ifdef MP-WEIXIN || APP-PLUS
    const MenuButton = uni.getMenuButtonBoundingClientRect()
    this.paddingTop = MenuButton.top + MenuButton.height
    // #endif
  },
  onLoad(options) {
    this.curTab = Number(options.type) || 0
    this.getData(1)
  },
  methods: {
    getData(pageNum) {
      const ids = this.tabList[this.curTab].id
      const obj = {
        pageSize: 10,
        pageNum
      }
      if (ids) {
        obj.ids = ids
      }
      service.get('/api/order/appList', obj).then(res => {
        this.getedData = true
        this.dataList = res.data.list || []
      })
    },
    switchTab: function(index, id) {
      this.curTab = index
      this.getData(1)
    },
    toDetail(id) {
      uni.navigateTo({
        url: '/pages/mine/orderdetail?id=' + id
      })
    },
    toNotice(id) {
      service.get(`/api/order/reminder?orderId=${id}`).then(res => {
        uni.showToast({
          title: '催单成功',
          icon: 'success',
          duration: 1000
        })
        this.getData(1)
      })
    },
    toCancel(id) {
      uni.showModal({
        title: '温馨提示',
        content: '确定要取消该订单吗？',
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            service.get('/api/order/cancelOrder/' + id).then(res => {
              uni.showToast({
                title: '取消订单成功',
                icon: 'success',
                duration: 1000
              })
              this.getData(1)
            })
          } else if (res.cancel) {
            console.log('点击取消')
          }
        }
      })
    },
    toDelete(id) {
      uni.showModal({
        title: '温馨提示',
        content: '确定要删除该订单吗？',
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            service.get('/api/order/deleteOrder/' + id).then(res => {
              uni.showToast({
                title: '删除订单成功',
                icon: 'success',
                duration: 1000
              })
              this.getData(1)
            })
          } else if (res.cancel) {
            console.log('点击取消')
          }
        }
      })
    },
    toPay(orderNo) {
      const obj = { orderNo, payType: 1 }
      service.post('/api/order/appPay', obj).then(res => {
        console.log(res.data)
        uni.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.packageValue,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: (res) => {
            uni.navigateTo({
              url: '/pages/mine/orders?key=2&backLen=2'
            })
          },
          fail: (res) => {
            this.getData(1)
            console.error(res)
          }
        })
      })
    }
  }
}
</script>
<style scoped>
.main{height: 100%;}
.toper{  width: 100%;   height: 170rpx;   background: #0469F7;   box-sizing: content-box;}
.tabs{width: 100%;height: 100rpx;margin: 10rpx auto;}
.tabs .item .txt{font-size:28rpx;font-weight: bold;color: #e1e1e1;}
.tabs .item .line{width:40rpx;height: 6rpx;background: #fff;margin-top:6rpx;opacity: 0;}
.tabs .item.on .txt{font-size:28rpx;color: #fff;}
.tabs .item.on .line{opacity: 1;}
.mybg { display: block; width: 750rpx; height: 540rpx; position: absolute; left: 0; top: 0; z-index: 0;}

.content {
  margin-top: -50rpx; width: 750rpx; box-sizing: border-box; background-color: #fff;
  border-radius: 20rpx 20rpx 0 0; padding: 30rpx 30rpx 0; position: relative; z-index: 567;
  overflow: auto;
}
.pList{
  margin-top: 20rpx;
}
.pList .uitem {
  margin-right: 20rpx;
}
.ritem{padding: 20rpx 0;border-bottom: 1rpx #e9e9e9 solid;}
.ritem .number{
  font-size: 24rpx; color: #666;
}
.ritem .status{
  color: #ff6662;
  font-size: 28rpx;
}
.ritem:last-child{
  border-bottom: none;
}
.pImg{
  width: 120rpx; height: 120rpx; border-radius: 8rpx;
}
.pTxt{
  font-size: 24rpx; border-radius: 8rpx;
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
</style>
