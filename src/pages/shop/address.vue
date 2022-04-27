<template>
  <view class="main">
    <div class="m1">
      <div class="cell ub ub-ac">
        <div class="tit">收货人</div>
        <input class="ub-f1 tx-l" :value="name" type="text" placeholder="输入收货人" @input="bindInput('name')" />
      </div>
      <div class="cell ub ub-ac btc">
        <div class="tit">联系电话</div>
        <input class="ub-f1 tx-l" :value="mobile" type="text" placeholder="输入联系电话" @input="bindInput('mobile')" />
      </div>
      <div class="cell ub ub-ac btc">
        <div class="tit">详细地址</div>
        <input class="ub-f1 tx-l" :value="IDNO" type="text" placeholder="输入详细地址" @input="bindInput('IDNO')" />
      </div>
    </div>
    <div class="plr15" style="margin-top:20rpx">
      <checkbox value="cb" checked="true" style="margin-right:12rpx" />下次默认此地址
    </div>
    <button form-type="submit" type="primary" class="btn" @click="submit">确 认</button>
  </view>
</template>
<script>
import service from '@/utils/http'
import constant from '@/utils/constant'
import { errDialog, loading } from '@/utils/util'
export default {
  data() {
    return {
      name: '',
      mobile: '',
      IDNO: '',
      landSample1: '',
      landSample2: '',
      isSelected: false
    }
  },
  methods: {
    bindInput: function(param) {
      this[param] = e.detail.value
    },
    submit: function() {
      if (this.name == '') {
        errDialog('请输入收货人')
        return
      }
      if (this.mobile == '') {
        errDialog('请输入联系电话')
        return
      }
      if (this.IDNO == '') {
        errDialog('请输入详细地址')
        return
      }
      service.get('collect/send/order?order=' + this.orderNo + '&id=' + uni.getStorageSync('userId')).then(res => {
        uni.showToast({ title: '寄送信息已提交', icon: 'none' })
        this.orderNo = ''
      })
    }
  }
}
</script>
<style scoped>
.m1{ background-color: #fff; padding: 0 30rpx;background: #ffffff;}
.cell {height: 96rpx;background: #fff;}
.cell .tit{width: 140rpx; font-size:28rpx;font-weight: bold;}
.cell input {font-size: 28rpx; color: #333; font-size:28rpx}
.subtit{font-size: 28rpx;color: #333;margin-bottom: 20rpx;}
.uploadImgDiv{width: 620rpx; height: 360rpx;background: #fff;border-radius: 12rpx;margin: 0 auto;}
.uploadImg {
  width: 240rpx;
  height: 360rpx;
  position: relative;
  margin: 0 auto;
}
.uImg {
  width: 240rpx;
  height: 240rpx;
  display: block;
}
.uTxt{
    color: #2784ff;
    font-size: 28rpx;
    margin-top:20rpx
}
.uPlus {
  width: 120rpx;
  height: 120rpx;
  display: block;
}
.btn{margin:60rpx auto 30rpx;border-radius: 50rpx;width: 650rpx;}

</style>
