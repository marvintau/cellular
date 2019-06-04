<template>
    <div id="cellular">
        <ActionControl :head="head" :actions="actions" />
        <table>            
            <TableGrid :grid="headComputed" :callback="handle"/>
            <TableGrid :grid="bodyTable" :callback="handle"/>
            <TableGrid v-if="canModifyDimension" :grid="addRowButton" :callback="handle"/>
        </table>
    <ol>
        <li>
            实现排序、筛选、单层汇总、级联汇总<br>

            可以应用级联汇总的，也可以应用单层汇总，反之不亦然。
            当应用级联汇总时，应用级联汇总的列需要提供级联函数，其它列需要提供被动的求和函数

            这三者事实上存在某种关系。当我们引入汇总机制的时候，即允许数据结构存在层级关系，
            这时对于全部数据排序会破坏层级关系，因此我们只允许对同一层级的数据进行排序。
            
            同样，对于已经按照一定方法排序过的flattened表进行汇总时，也会破坏现有的排序。
            同理，当我们进行筛选的时候，也会破坏现有的排序和汇总操作的结果。。

            因此，我们不保存排序后的数据，而只保存我们进行的操作顺序，如同记录日志一样。
        </li>
    </ol>
    </div>
</template>

<script>
import TableGrid from './TableGrid.vue'
import ActionControl from './ActionControl.vue'
import {genTable} from '../CellularModel.js'
import {sort} from '../CellularModel.js'

export default {

    name: 'Cellular',
    data(){
        return { 
            actions: []
        }
    },
    props: {
        body: Array,
        head: Array,
        canModifyDimension: Boolean,
    },
    computed: {
        headComputed: function(){
            let headDefault = this.head;
            return headDefault;
        },
        bodyTable: function(){
            let bodyCopy = this.body.slice().map(e => Object.assign({}, e));
            
            for (let action of this.actions){
                switch(action.action){
                    case 'sort':
                        let key = action.column;
                        bodyCopy.sort((a, b) => a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0);
                        break;
                }
            }

            return genTable(bodyCopy);
        }
    },
    methods: {
        handle(methodName, event){
            if(methodName !== 'handle')
                this[methodName](event);
        },

        addRow(){
            console.log(this.head.last().most());
            this.body.push(this.head.last().most().map(e => e.attr.default));            
        },
        
        addCol(){
            
            for (let row of this.body){
                row.push(Object.assign({}, row.last()))
            }
        },
    },

    components: {
        TableGrid,
        ActionControl
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
    margin: 10px;
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
