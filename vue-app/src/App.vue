<template>
  <div id="app">
    {{count}}
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
      count: 0
    }
  },
  mounted () {
    this.$parent.$on('TEST', payload => {
      this.count = payload
    })
  }
}
</script>

<style>

</style>
