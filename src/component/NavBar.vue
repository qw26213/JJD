<template>
  <div class="pageHeader">
    <div class="navbar" :class="{'normal':transpent!=1}" :style="'height:' +  demo.height + 'px;' + 'padding-top:' + demo.top + 'px;padding-bottom:20rpx;line-height:' + demo.height + 'px;'" @click.stop="bindTit">
      <image v-show="isShow && transpent!=1 && homebutton === 0" class="left" :style="'top:' + demo.top + 'px'" src="../static/back.png" mode="aspectFill" @click.stop="toBack" />
      <image v-show="isShow && transpent==1 && homebutton === 0" class="left" :style="'top:' + demo.top + 'px'" src="../static/back1.png" mode="aspectFill" @click.stop="toBack" />
      <image v-show="homebutton === 1" class="left1" :style="'top:' + demo.top + 'px'" src="../static/back2.png" mode="aspectFill" @click.stop="toHome" />
      {{ title == 0 ? '' : title }}
    </div>
    <div v-if="transpent!=1" class="nullkey" :style="'height:' +  demo.height + 'px;' + 'padding-top:' + demo.top + 'px;padding-bottom:20rpx;'"></div>
  </div>
</template>

<script>
    export default {
        props: {
            transpent: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            ishome: {
                type: String,
                default: ''
            },
            homebutton: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                isShow: false,
                demo: {
                    top: 10,
                    height: 44
                }
            }
        },
        created () {
            var pages = getCurrentPages()
            this.isShow = pages.length > 1
            // #ifdef MP-WEIXIN
            const MenuButton = uni.getMenuButtonBoundingClientRect()
            this.demo.top = MenuButton.top
            this.demo.height = MenuButton.height
            // #endif

            // #ifdef APP-PLUS
            uni.getSystemInfo({
                success: (e) => {
                    this.demo.top = e.statusBarHeight
                    this.demo.height = e.navigationBarHeight
                }
            })
            // #endif

        },
        methods: {
            toHome() {
                uni.switchTab({
                    url: '/pages/home/index'
                })
            },
            toBack() {
                uni.navigateBack()
            },
            bindTit() {
                const share = uni.getStorageSync('storeShare') || 0
                if (this.ishome === '1' && share === 0) {
                    uni.navigateTo({
                        url: '/pages/home/select'
                    })
                }
            }
        }
    }
</script>

<style scoped>
.navbar{
    height: 88rpx;
    width: 100%;
    z-index: 99999;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: bold;
    color:#fff;
    box-sizing: content-box;
}
.nullkey{
    box-sizing: content-box;
}
.normal{
    background: #fff;
    color:#333
}
.left{
    position: absolute;
    width: 68rpx;
    height: 68rpx;
    top: 10rpx;
    left: 20rpx;
}
.left1{
    position: absolute;
    width: 58rpx;
    height: 58rpx;
    top: 15rpx;
    left: 20rpx;
}
</style>