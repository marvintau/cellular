<template>
    <div id="app">
        <Cellular :canModifyDimension="false" :head="head" :body="body" />
    </div>
</template>

<script>
import Cellular from './components/Cellular.vue'

import {createRandomJournal} from './randomBook.js'
import {genTable, genHead} from './CellularModel.js'

let journal = createRandomJournal();

export default {
  data(){
    return {
      body: journal,
      head: genHead(journal[0])
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
