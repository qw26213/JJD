<template>
  <div class="main ub ub-ver">
    <NavBar title="我的积分" transpent="1" />
    <div class="toper" :style="'padding-top:'+ (paddingTop) + 'px'">
      <image src="../../static/bg.jpg" class="mybg" mode="aspectFill" :style="'height:'+ (paddingTop + 150) + 'px'" />
      <div class="rbtn ub ub-ac ub-pe">
        <span class="cell" @click="toRecord">明细</span>
        <span class="cell" @click="showInst">说明</span>
      </div>
    </div>
    <div class="headCon">
      <div class="ub ub-ac">
        <div class="item ub-f1 ub ub-ver ub-ac" @click.stop="toLogin">
          <div v-if="token" class="scount">{{ dataInfo.points || '0' }}</div>
          <div v-else>登录</div>
          <div class="scTxt ub ub-ac">
            <image class="sIcon" src="../../static/icon_point.png" mode="aspectFill" />我的总积分
          </div>
        </div>
        <div class="item ub-f1 ub ub-ver ub-ac" @click.stop="toLogin">
          <div v-if="token" class="scount">{{ dataInfo.pointsBalance || '0' }}</div>
          <div v-else>登录</div>
          <div class="scTxt ub ub-ac">
            <image class="sIcon" src="../../static/icon_user.png" mode="aspectFill" />积分账户
          </div>
        </div>
      </div>
      <div class="tit" style="margin-top:20rpx">积分兑换</div>
    </div>
    <div class="content ub-f1">
      <div v-for="(item, index) in dataList" :key="index" class="sItem ub ub-ac">
        <image class="sImg" :src="item.pImg" mode="aspectFill" />
        <div class="ub-f1">
          <div class="sTit">{{ item.name }}</div>
          <div class="sTxt">{{ item.skuPoints }}</div>
        </div>
        <button v-if="item.stock && item.stock > 0" class="sBtn" @click="toDetail(item.id)">立即兑换</button>
        <button v-else class="sBtn" style="background:#96c0fc">已兑换完</button>
      </div>
    </div>
    <div v-if="isModal" class="mask" @click="isModal = false" />
    <div v-if="isModal" class="modal">
      <div class="tx-c mtit">积分说明</div>
      <p class="ctit">一、积分获得方式</p>
      <p class="cell">用户在报名门店赛事活动后参加比赛，赢得比赛后由门店工作人员为您增加相应的积分，增加成功后即可在您的积分账户中查看相应积分。在本门店获得的积分仅可在本门店使用。总积分为在本门店总共获得的积分，只增不减，门店积分前100名即可显示在赛事排行榜；积分账户显示可兑换商品的有效积分。</p>
      <p class="ctit">二、积分使用方式</p>
      <p class="cell">用户在该门店选择可积分兑换的商品进行积分兑换，结算时选择积分兑换即可使用积分进行商品购买。兑换所需积分根据具体兑换商品确定，详情可见各积分兑换商品。当商品兑换提示“已达上限”时，表示当前商品已达可兑上限，此时可选择其他商品进行兑换。</p>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
import { errDialog, loading, toPage } from '@/utils/util'
export default {
  filters: {
    numFormat(num) {
      return Number(num).toFixed(2)
    }
  },
  data() {
    return {
      paddingTop: 50,
      isModal: false,
      isBottom: false,
      token: false,
      pageNum: 1,
      dataInfo: {},
      dataList: []
    }
  },
  onShow() {
    // #ifdef MP-WEIXIN || APP-PLUS
    const MenuButton = uni.getMenuButtonBoundingClientRect()
    this.paddingTop = MenuButton.top + MenuButton.height
    // #endif
    this.token = uni.getStorageSync('Access-Token')
    this.getData()
  },
  onReachBottom() {
    if (!this.isBottom) {
      this.pageNum++
      this.getList()
    }
  },
  onLoad() {
    this.getList()
  },
  methods: {
    toLogin() {
      if (!this.token) {
        uni.navigateTo({
          url: '/pages/login/index'
        })
      }
    },
    toDetail(id) {
      toPage('/pages/shop/detail?id=' + id + '&type=1')
    },
    toRecord() {
      uni.navigateTo({
        url: '/pages/mine/pointrecord'
      })
    },
    showInst() {
      this.isModal = true
    },
    getData() {
      service.get('/api/points/getUserPoints').then(res => {
        this.dataInfo = res.data || {}
      })
    },
    getList() {
      service.get('/api/points/goods/list?params[pageSize]=50&params[pageNum]=' + this.pageNum).then(res => {
        const result = res.data.list || []
        this.dataList = this.dataList.concat(result)
        this.dataList.forEach(it => {
          it.pImg = it.pic.split(',')[0]
        })
        this.isBottom = result.length < 10
      })
    }
  }
}

</script>
<style scoped>
.main{width: 100%; height: 100%;}
.toper{ width: 100%; height: 120rpx;box-sizing: content-box;overflow: hidden;}
.mybg { display: block; width: 750rpx; height: 300rpx; position: absolute; left: 0; top: 0; z-index: 0;}
.rbtn{ margin-top: 56rpx; padding-right: 20rpx; }
.rbtn .cell{ color: #fff; font-size: 26rpx; width: 90rpx;display: block;text-align: center;height:48rpx; }
.headCon{padding: 24rpx 24rpx 10rpx;background: #fff;position: relative;z-index: 100;border-radius: 20rpx 20rpx 0 0;}
.content{overflow: auto;padding: 6rpx 24rpx 0;background: #fff;position: relative;z-index: 100;}
.tit{font-weight: bold;font-size: 32rpx;}
.citem { height: 80rpx; background: #fff; line-height: 80rpx; border-bottom: 1rpx #eee solid;}
.citem .txt{ font-size: 28rpx; }
.sItem{padding-bottom: 20rpx;padding-top: 20rpx; border-bottom: 1rpx #e5e5e5 solid;}
.sItem:last-child{border-bottom: none;}
.sImg{width: 110rpx; height:110rpx;border-radius:12rpx;border:1rpx #eee solid;box-sizing: border-box;}
.sTit{font-size: 26rpx; color: #333; padding-left:10rpx;}
.sTxt{font-size: 24rpx; color: #3387ff; padding-left:10rpx; margin-top: 12rpx;}
.sBtn{font-size: 24rpx; width:150rpx; height: 54rpx; background-color: #3387ff;color: #fff;padding: 0;line-height: 54rpx;}
.modal{
  position: fixed; width: 600rpx; height: 860rpx; top: 50%; left: 75rpx; z-index: 1000; background: #fff;
  border-radius: 16rpx;padding: 24rpx;margin-top:-350rpx;
}
.sIcon{display: block; width: 24rpx;height: 24rpx;margin-right:8rpx;}
.scount{font-size: 48rpx;color: #333;}
.scTxt{font-size: 24rpx;color: #666;}
.mtit{font-size:30rpx;font-weight: bold;}
.ctit{line-height: 50rpx; font-size: 28rpx;}
.cell{line-height: 44rpx; font-size: 28rpx;}
.mask{position: fixed; width: 100%; height: 100%; top: 0; left: 0; background: rgba(0, 0, 0, 0.5); z-index: 100;}
</style>
