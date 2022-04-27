<template>
  <view class="main">
    <NavBar title="机位" />
    <div class="cell plr15 ub ub-ac btc">
      <div class="tit">订购数量</div>
      <input class="ub-f1 tx-r" :value="mobile" maxlength="11" type="text" placeholder="请输入订购数量" @input="bindInput1" />
    </div>
    <div class="cell plr15 ub ub-ac btc">
      <div class="tit">收货地址</div>
      <input class="ub-f1 tx-r" :value="address" type="text" placeholder="请输入收货地址" @input="bindInput2" />
    </div>
    <div class="btn-area">
      <button form-type="submit" type="primary" role="button" aria-disabled="false" @click="submit">提交</button>
    </div>
  </view>
</template>
<script>
import service from '@/utils/http'
import { errDialog, loading } from '@/utils/util'
export default {
  data() {
    return {
      mobile: '100',
      address: '北京市朝阳区科技园'
    }
  },
  onLoad() {

  },
  methods: {
    bindInput1: function(e) {
      this.mobile = e.detail.value
    },
    bindInput2: function(e) {
      this.address = e.detail.value
    },
    submit: function() {
      if (this.mobile == '') {
        errDialog('订购数量不能为空！')
        return
      }
      if (this.address == '') {
        errDialog('收货地址不能为空！')
        return
      }
      const obj = {
        user_name: this.mobile,
        user_address: this.address,
        type: 2
      }
      service.post('collect/user/submit', obj).then(res => {
        uni.showToast({
          title: '订购成功',
          icon: 'success'
        })
      })
    }
  }
}
</script>
<style>
.cell {
    height: 100rpx;
    background: #fff;
}

.tit {
    font-size: 28rpx;
    color: #333;
    margin-right: 20rpx;
}

.cell input {
    font-size: 28rpx;
    color: #333;
}
</style>
