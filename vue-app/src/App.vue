<template>
  <div id="app">
    <div class="rows">
      <div class="row header">
        E.N.Z.O.
      </div>
      <div class="row button-indicators">
        <div class=" is-red" :class="{'is-active': buttons.MAIN_SW_1}">M1</div>
        <div class=" is-red" :class="{'is-active': buttons.MAIN_SW_2}">M2</div>
      </div>
      <div class="row button-indicators">
        <div class=" is-yellow" :class="{'is-active': buttons.TRIPLE_SW_1}">T1</div>
        <div class=" is-yellow" :class="{'is-active': buttons.TRIPLE_SW_2}">T2</div>
        <div class=" is-yellow" :class="{'is-active': buttons.TRIPLE_SW_3}">T3</div>
      </div>
      <div class="row button-indicators">
        <div class=" is-purple" :class="{'is-active': buttons.ARCADE_1}">A1</div>
        <div class=" is-purple" :class="{'is-active': buttons.ARCADE_2}">A2</div>
        <div class=" is-purple" :class="{'is-active': buttons.ARCADE_3}">A3</div>
      </div>
      <div class="row button-indicators">
        <div class=" is-green" :class="{'is-active': buttons.ROCKER_GR_1}">RG1</div>
        <div class=" is-green" :class="{'is-active': buttons.ROCKER_GR_2}">RG2</div>
      </div>
      <div class="row button-indicators">
        <div class=" is-red" :class="{'is-active': buttons.ROCKER_RD_1}">RR1</div>
        <div class=" is-red" :class="{'is-active': buttons.ROCKER_RD_2}">RR2</div>
      </div>
      <div class="row console">
        <div class="content">
          <div v-for="(log, key) in logs" :key="key">
            <div>
              <span class="timestamp">{{log.timestamp.valueOf()}}: </span>
              <span class="message">{{log.message}}</span>
            </div>
            <div class="payload">{{log.payload}}</div>
          </div>
        </div>
      </div>
      <div class="row slider">
        <div class="indicator-wrapper">
          <div class="indicator" :style="{left: slider/1024*100 + '%'}"></div>
        </div>
      </div>
      <div class="row footer">
        E.N.Z.O. - &copy; 2018
      </div>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  data () {
    return {
      buttons: {},
      slider: 0,
      logs: []
    }
  },
  methods: {
    addLog (message, payload) {
      this.logs.push({
        timestamp: new Date(),
        message: message,
        payload: payload
      })

      if (this.logs.length > 100) {
        this.logs = this.logs.slice(this.logs.length - 100)
      }
    }
  },
  mounted () {
    this.$parent.$on('buttons', payload => {
      this.buttons = payload
      this.addLog('buttons', payload)
    })
    this.$parent.$on('slider', payload => {
      this.slider = payload
      this.addLog('slider', payload)
    })
    this.$parent.$on('auto_off', payload => {
      this.addLog('auto_off', payload)
    })
  }
}
</script>

<style lang="scss">
#app {
  background-color: #111;
  width: 460px;
  height: 780px;
  padding: 10px;
  font-size: 20px;
}
.rows {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .header {
    font-size: 24px;
    font-weight: bold;
    line-height: 40px;
    background-color: #333;
    border: 1px solid white;
    color: white;
    text-align: center;
  }
  .button-indicators {
    display: flex;
    div {
      border-bottom-right-radius: 10px;
      flex: 1;
      border: 1px solid #666;
      background-color: #000;
      color: #999;
      line-height: 60px;
      text-align: center;
      margin-right: 10px;
      //transition: background-color 0.25s, border-color 0.1s;
      &.is-active {
        border-color: #ffffff;
        background-color: #666666;
        color: white;
        &.is-red {
          border-color: #ff0000;
          background-color: #660000;
        }
        &.is-green {
          border-color: #00ff00;
          background-color: #006600;
        }
        &.is-yellow {
          border-color: #ffff00;
          background-color: #666600;
        }
        &.is-purple {
          border-color: #ff00ff;
          background-color: #660066;
        }
      }
      &:last-child {
        margin-right: 0;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .slider {
    height: 30px;
    border: 1px solid #00ffff;
    background-color: #003333;
    padding-right: 30px;
    .indicator-wrapper {
      position: relative;
      .indicator {
        transition: left 0.25s;
        position: absolute;
        width: 30px;
        height: 30px;
        background-color: #00ffff;
      }
    }
  }
  .console {
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 13px;
    line-height: 13px;
    flex: 1;
    border: 1px solid #666;
    background-color: black;
    overflow: hidden;
    position: relative;
    .content {
      position: absolute;
      padding: 10px;
      width: 100%;
      bottom: 0;
      .timestamp {
        color: #666;
      }
      .message {
        color: #999;
      }
      .payload {
        color: #333;
        font-size: 10px;
      }
    }
  }
  .footer {
    font-size: 12px;
    line-height: 30px;
    background-color: black;
    border: 1px solid #333;
    text-align: center;
  }
}
</style>
