<template>
    <div id="cellular">
        <table>
            <TableGrid :grid="head" :callback="handle"/>
            <TableGrid :grid="body" :callback="handle"/>
            <TableGrid :grid="lastLine" :callback="handle"/>
        </table>
    <ol>
        <li>插入新行/新列</li>        
    </ol>
    </div>
</template>

<script>
import TableGrid from './TableGrid.vue'
import {genHead} from '../CellularModel.js'


Array.prototype.last = function(){
    return this[this.length - 1];
}

Array.prototype.beforeLast = function(){
    return this[this.length - 2];
}

Array.prototype.most = function(){
}

export default {

    name: 'Cellular',
    data(){
        return { lastLine: [[{data:'添加行', attr:{type:"button", style:"extra", handler:"addRow"}}]] }
    },
    props: {
        body: Array,
    },
    computed: {
        head: function(){
            return genHead(this.body[0].length);
        }
    },
    methods: {
        handle(methodName, event){
            if(methodName !== 'handle')
                this[methodName](event);
        },

        addRow(){
            this.body.push(this.head.last().map(e => e.attr.default));            
        },
        
        addCol(){
            
            for (let row of this.body){
                console.log(row.last());
            }
        }
    },
    components: {
        TableGrid
    }
}
</script>

<style>

#cellular {
    width: 90vw;
    overflow-x: auto;
}

#cellular table{
    border-collapse: collapse;
}

#cellular table td {
    padding: 0px;
    height: 40px;
    min-width: 160px;
    max-width: 200px;
}

.cell {
    border: 1px solid black;
}

.extra {
    padding: 10px;
    margin: 10px;
    font-weight: bold;
    font-size: 110%;
}

.btn {
    width: 60px;
    font-size:0.8em;
    border: 1px solid black;
    border-radius: 5px;
    outline: none;
}

input {
    width: 95%;
    height: 95%;
    font-size:1em;
    padding: 0px !important;
    margin: 2px !important;
    border: none !important;
    outline: none;
    background: transparent;
}

.label {
    margin: 5px;
}

</style>
