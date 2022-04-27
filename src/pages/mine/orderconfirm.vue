<template>
  <div class="main">
    <NavBar title="确认订单" transpent="1" />
    <div class="toper" :style="'padding-top:'+ (paddingTop + 20) + 'px'">
      <image src="../../static/bg.jpg" class="mybg" mode="aspectFill" :style="'height:'+ (paddingTop + 100) + 'px'" />
      <div v-if="attach.logisticsType == 1" class="topTxt1 z99 plr20">门店前台自提</div>
      <div v-if="attach.logisticsType == 2" class="topTxt1 z99 plr20">预计3日内发货</div>
      <div v-if="attach.logisticsType == 3" class="topTxt1 z99 plr20">即刻送达</div>
    </div>
    <div class="content">
      <div class="pList p10">
        <div class="uitem ub ub-ac">
          <image class="pImg" :src="shopdetail.pImg" mode="aspectFill" />
          <div style="margin-left:20rpx">
            <div class="pTit">{{ shopdetail.name }}</div>
            <div class="pTxt">{{ skuObj.attrVal }}</div>
            <div class="pTxt" style="margin-top:10rpx">*{{ count }}</div>
          </div>
          <div class="total">
            ￥{{ totalprice }}
            <span style="margin-left:10rpx">积分:{{ shopdetail.skuPoints }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="elseDiv">
      <div class="cell ub ub-ac">
        <div class="itemTit">选择配送方式</div>
        <radio-group class="ub-f1 tx-r" @change="radioChange">
          <label v-for="(item,index) in types" :key="index" class="radio" style="margin-right:10rpx;font-size:24rpx">
            <radio :value="item.id" :checked="attach.logisticsType == item.id" color="#0099ff" />
            {{ item.name }}
          </label>
        </radio-group>
      </div>
      <div v-if="attach.logisticsType == 2" class="cell ub ub-ac">
        <div class="itemTit">收件人姓名</div>
        <input class="ub-f1 tx-r" :value="address1" data-parm="address1" type="text" placeholder="收件人姓名" @input="bindInput1" />
      </div>
      <div v-if="attach.logisticsType == 2" class="cell ub ub-ac">
        <div class="itemTit">手机号</div>
        <input class="ub-f1 tx-r" :value="address2" data-parm="address2" type="text" placeholder="手机号" @input="bindInput1" />
      </div>
      <div v-if="attach.logisticsType == 2" class="cell ub ub-ac">
        <div class="itemTit">收件地址</div>
        <input class="ub-f1 tx-r" :value="address3" data-parm="address3" type="text" placeholder="收件地址" @input="bindInput1" />
      </div>
      <div v-if="attach.logisticsType == 3" class="cell ub ub-ac">
        <div class="itemTit">机位码</div>
        <input class="ub-f1 tx-r" :value="attach.address" data-parm="address" type="text" placeholder="机位码" @input="bindInput" />
      </div>
      <div class="cell ub ub-ac">
        <div class="itemTit">备注</div>
        <input class="ub-f1 tx-r" :value="attach.remark" data-parm="remark" type="text" placeholder="备注" @input="bindInput" />
      </div>
      <div v-if="goodType===1" class="cell ub ub-ac">
        <div class="itemTit">支付方式</div>
        <radio-group class="ub-f1 tx-r" @change="radioChange1">
          <label class="radio" style="margin-right:10rpx;font-size:24rpx">
            <radio :value="2" :checked="attach.payType == 2" color="#0099ff" />微信支付
          </label>
          <label class="radio" style="margin-right:10rpx;font-size:24rpx">
            <radio :value="4" :checked="attach.payType == 4" color="#0099ff" />积分兑换
          </label>
        </radio-group>
      </div>
    </div>
    <div class="ub ub-ac ub-pe bottom">
      <div class="ub-f1 plr15" style="color:#fff">{{ attach.payType == 2 ? '￥'+totalprice : '积分:'+shopdetail.skuPoints }}</div>
      <button class="btn1 ub ub-ac ub-pc" :disabled="btnLoading" @click="createOrder">一键结算</button>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
import { errDialog, loading, getStorageStore } from '@/utils/util'
export default {
  data() {
    return {
      sceneId: '',
      shopdetail: {},
      id: '',
      skuObj: '',
      btnLoading: false,
      skuId: '',
      count: 0,
      totalprice: '',
      goodType: 1,
      types: [{ name: '自提', id: '1' }, { name: '外送', id: '2' }, { name: '店送', id: '3' }],
      attach: {
        logisticsType: '3',
        address: '',
        remark: '',
        payType: 2 // 微信支付是2，积分支付是5
      },
      address1: '',
      address2: '',
      address3: '',
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
  async onLoad(options) {
    console.log(options)
    if (options.scene) {
      this.sceneId = options.scene
      const orderId = options.scene
      const res = await service.get(`/api/pad/order/detail/${orderId}`)
      const ret = res.data[0]
      this.id = ret.subOrders[0].productId
      this.goodType = ret.type
      this.skuId = ret.subOrders[0].productSkuId
      this.count = ret.subOrders[0].count
      this.attach.logisticsType = String(ret.logisticsType)
      this.attach.address = ret.address
      this.attach.payType = ret.payType
      this.attach.remark = ret.remark
    } else {
      this.id = options.id
      this.goodType = options.gType
      this.skuId = options.skuId
      this.count = options.count
    }
    this.getData()
  },
  methods: {
    radioChange1(evt) {
      this.attach.payType = evt.detail.value
    },
    radioChange(evt) {
      this.attach.logisticsType = evt.detail.value
      this.attach.address = ''
    },
    bindInput1(evt) {
      const parm = evt.currentTarget.dataset.parm
      this[parm] = evt.detail.value
    },
    bindInput(evt) {
      const parm = evt.currentTarget.dataset.parm
      this.attach[parm] = evt.detail.value
    },
    getData() {
      service.get(`/api/goods/detail/${this.id}`).then(res => {
        this.shopdetail = res.data
        this.shopdetail.pImg = this.shopdetail.pic.split(',')[0]
        const skuList = res.data.skuList
        const skuObj = skuList.find(it => it.id === this.skuId)
        this.skuObj = skuObj.skuValList[0]
        this.totalprice = Number(skuObj.price) * Number(this.count)
      })
    },
    createOrder() {
      if (this.attach.logisticsType === '') {
        return errDialog('配送方式不能为空')
      }
      if (this.address1 == '' && this.attach.logisticsType == '2') {
        return errDialog('收货人姓名不能为空')
      }
      if (this.address2 == '' && this.attach.logisticsType == '2') {
        return errDialog('手机号不能为空')
      }
      if (this.address3 == '' && this.attach.logisticsType == '2') {
        return errDialog('收货地址不能为空')
      }
      if (this.attach.address === '' && this.attach.logisticsType == '3') {
        return errDialog('机位码不能为空')
      }
      if (this.attach.logisticsType == '2') {
        this.attach.address = this.address1 + ',' + this.address2 + ',' + this.address3
      }
      const skuObj = {
        productId: this.shopdetail.id,
        productSkuId: this.skuId,
        count: this.count,
        pic: this.shopdetail?.pic,
        name: this.shopdetail?.name,
        price: this.shopdetail.price,
        strSkus: this.skuName
      }
      const order = {
        ...this.attach,
        type: this.goodType,
        subOrders: [skuObj]
      }
      this.btnLoading = true
      if (this.goodType == 1) {
        const url = this.sceneId === '' ? '/api/order/createOrderApp' : '/api/pad/order/bindPay'
        if (this.sceneId) {
          order.id = this.sceneId
        }
        service.post(url, order).then(res => {
          if (this.attach.payType == '2') {
            const orderId = res.data.orderId
            this.toPay(orderId)
          } else {
            uni.redirectTo({
              url: '/pages/mine/orders?type=2'
            })
          }
        })
      }
      if (this.goodType == 5) {
        const url = this.sceneId === '' ? '/api/sass/createOrderApp' : '/api/pad/sass/order/bindPay'
        if (this.sceneId) {
          order.id = this.sceneId
        }
        const store = getStorageStore()
        order.storeId = store.id
        service.post(url, [order]).then(res => {
          this.payOrder(res.data.wx)
        })
      }
    },
    toPay(orderId) {
      const obj = { orderNo: orderId, payType: 2 }
      service.post('/api/order/appPay', obj).then(res => {
        this.payOrder(res)
      }).catch(res => {
        this.btnLoading = false
      })
    },
    payOrder(res) {
      uni.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.packageValue,
        signType: res.signType,
        paySign: res.paySign,
        success(res) {
          uni.redirectTo({
            url: '/pages/mine/orders?type=2'
          })
        },
        fail(res) {
          uni.redirectTo({
            url: '/pages/mine/orders?type=1'
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.toper{  width: 100%; height: 170rpx; box-sizing: content-box;}
.mybg { display: block; width: 750rpx; height: 540rpx; position: absolute; left: 0; top: 0; z-index: 0;}
.content {
  margin: -90rpx auto 30rpx; width: 710rpx; box-sizing: border-box;
  background-color: #fff; border-radius: 20rpx;
  position: relative; z-index: 567;
}
.itemTxt{
  height: 80rpx;;padding-left: 20rpx;font-size: 26rpx;line-height: 70rpx;
}
.pImg{
  width: 140rpx; height: 140rpx; border-radius: 12rpx; border: 1rpx #e5e5e5 solid;
}
.pTit{
  font-size: 28rpx;color:#333
}
.pTxt{
  font-size: 24rpx;color:#999
}
.uitem + .uitem{margin-top: 20rpx;}
.total{ position: absolute; bottom: 0rpx; right: 20rpx; font-size: 24rpx; color:#fe5864}
.btn1 { width: 190rpx; height: 98rpx; font-size: 28rpx;background: #0099ff;color: #fff; border-radius: 0;}
.btn1::after { border: 0;}
.btn1[disabled] { background: #8fc6ea; color: #fff; }
.bottom{ position: fixed; bottom: 0;left:0;width: 100%;height: 98rpx;background: #666;z-index: 11;}
.elseDiv{border-radius: 20rpx; background: #fff; padding: 10rpx 30rpx; margin: 30rpx auto 30rpx; width: 710rpx; }
.itemTit{ font-size: 28rpx; width: 200rpx;}
.cell{height: 92rpx;}
.elseDiv input{font-size: 28rpx}
.topTxt1{font-size:32rpx; color:#fff}
.topTxt2{font-size:24rpx; color:#eee}
</style>
