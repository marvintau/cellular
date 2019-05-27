<template>
    <div id="app">
        <Cellular v-bind:head="head" v-bind:body="body" />
    </div>
</template>

<script>
import Cellular from './components/Cellular.vue'

import {genTable} from './CellularModel.js'

export default {
  data(){
    return {
      body: genTable(5, 10)
    }
  },
  created: () => {
  },
  name: 'app',
  components: {
    Cellular
  }
}
</script>

<style>
#app {
  /* text-align: center; */
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 20px;
  line-height: 200%;
}
</style>
