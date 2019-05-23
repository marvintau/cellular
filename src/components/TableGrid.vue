<template >
    <tbody>
        <tr v-for="(row, rkey) in grid" :row="row" :key="rkey">
            <td v-for="(col, ckey) in row" :key="ckey" :class="col.attr.style">
                <button class="btn" v-if="col.attr.type=='button'" @click="handle(col.attr.handler, $event)">{{col.data}}</button>
                <input v-else-if="col.attr.type=='editable'" v-model="col.data">
                <div class="label" v-else-if="col.attr.type=='label'">{{col.data}}</div>
            </td>
        </tr>
    </tbody>
</template>

<script>
export default {
    name: 'Tablebody',
    props: {
        grid: Array,
        callback: Function,
    },
    methods: {
        handle(methodName, event){
            if(methodName !== 'handle'){
                return this.callback(methodName, event);
            }
        },
    }
}
</script>

<style scoped>

</style>
