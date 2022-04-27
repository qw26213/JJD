<template>
  <view class="main">
    <NavBar title="实名认证" />
    <div class="m1">
      <div class="cell ub ub-ac">
        <div class="tit">姓名</div>
        <input class="ub-f1 tx-l" :value="name" type="text" placeholder="请输入姓名" @input="bindInput1" />
      </div>
      <div class="cell ub ub-ac btc">
        <div class="tit">身份证号</div>
        <input class="ub-f1 tx-l" :value="IDNO" type="text" placeholder="请输入身份证号" @input="bindInput2" />
      </div>
    </div>
    <!-- <div class="plr15" style="margin-top:20rpx;font-size:24rpx">
      <checkbox value="cb" checked="true" style="margin-right:12rpx" />已阅读并同意《XXX用户服务协议》
    </div>-->
    <button form-type="submit" type="primary" class="btn" @click="submit">立即认证</button>
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
      IDNO: ''
    }
  },
  methods: {
    bindInput1: function(e) {
      this.name = e.detail.value
    },
    bindInput2: function(e) {
      this.IDNO = e.detail.value
    },
    submit: function() {
      if (this.name == '') {
        errDialog('请输入姓名')
        return
      }
      if (this.IDNO == '') {
        errDialog('请输入身份证号')
        return
      }
      const obj = {
        'name': this.name,
        'idcard': this.IDNO,
        'mobile': ''
      }
      service.post('/api/identification/saveIdCard', obj).then(res => {
        uni.showToast({ title: '实名认证成功', icon: 'none' })
        uni.navigateBack()
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
