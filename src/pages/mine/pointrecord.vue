<template>
  <div class="main ub ub-ver">
    <NavBar title="积分明细" transpent="1" />
    <div class="toper" :style="'padding-top:'+ (paddingTop) + 'px'">
      <image src="../../static/bg.jpg" class="mybg" mode="aspectFill" :style="'height:'+ (paddingTop + 120) + 'px'" />
      <div class="tabs ub ub-ac">
        <div v-for="(item,index) in tabList" :key="index" class="item ub-f1 ub ub-ver ub-ac" :class="{'on': curTab==index}" @click="switchTab(index)">
          <div class="txt tx-c">{{ item.name }}</div>
          <div class="line" />
        </div>
      </div>
    </div>
    <div v-if="dataList.length > 0" class="content ub-f1">
      <div v-for="(item, index) in dataList" :key="index" class="ritem">
        <div class="ub ub-pj">
          <div class="number">积分兑换</div>
          <div class="status">-100积分{{}}</div>
        </div>
        <div class="number">10元网费</div>
        <div class="date">2020-01-01 10:00:00</div>
      </div>
    </div>
    <div v-if="dataList.length === 0" class="content ub-f1 ub ub-ver ub-ac ub-pc">
      <image class="nodataImg" src="../../static/null/null3.png" mode="widthFix" />
      <div class="nodataTxt">暂无积分记录</div>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
import constant from '@/utils/constant'
import { errDialog, loading } from '@/utils/util'
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
        name: '收入',
        id: '0'
      }, {
        name: '支出',
        id: '1'
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
      const status = this.tabList[this.curTab].id
      const obj = {
        pageSize: 10,
        pageNum
      }
      if (status) {
        obj.status = status
      }
      service.get('/api/points/record', obj).then(res => {
        this.getedData = true
        this.dataList = res.data.list || []
      })
    },
    switchTab(index) {
      this.curTab = index
      this.getData()
    }
  }
}
</script>
<style scoped>
.main{height: 100%;}
.toper{  width: 100%;   height: 170rpx;   background: #0469F7;   box-sizing: content-box;}
.tabs{width: 100%;height: 100rpx;margin: 10rpx auto;}
.tabs .item .txt{font-size:32rpx;font-weight: bold;color: #e1e1e1;}
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
