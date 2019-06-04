<template>
    <div class="action-control">
        <div>
            <p v-for="(action, i) in actions" :key="i">
                在{{action.column}}字段上使用了{{action.action}}操作 <button :index="i" @click="removeAction">去除</button>
            </p>
        </div>
        <div v-if="actions.every(e=>!(['filter', 'gather'].indexOf(e.actions)))">
            在
            <select @change="setColumn"><option v-for="(col, i) in columns" :key="i">{{col}}</option></select>
            上进行
            <select @change="setAction">
                <option value="sort" selected="selected">排序</option>
                <option value="filter">筛选</option>
                <option value="gather">汇总</option>
            </select>
            操作
            <button @click="addAction">添加</button>
        </div>
        <div v-else>在包含筛选或汇总的视图中，不能再进行其他操作了</div>
    </div>
</template>

<script>
export default {
    props: {
        head : Array,
        actions: Array
    },
    data: function(){
        return {
            selectedAction: 'sort',
            selectedColumn: this.head.last()[0].data
        }
    },
    computed: {
        columns: function(){
            return this.head.last().map(e => e.data);
        }
    },
    created: function(){
        console.log(this.head.last());
    },
    methods: {
        setAction(e){
            this.selectedAction = e.target.value;
        },
        setColumn(e){
            this.selectedColumn = e.target.value;
        },
        addAction(e){
            if(this.selectedColumn !== undefined && this.selectedAction !== undefined)
                this.actions.push({
                    column: this.selectedColumn,
                    action: this.selectedAction
                })
        },
        removeAction(e){
            // console.log(e.currentTarget.getAttribute('index'));
            let index = e.currentTarget.getAttribute('index');
            this.actions.splice(index, 1);
        }
    }
}

</Script>

<style scoped>
.action-control{
    width: 100vw;
    margin: 20px 0;
}

select {
    border: 1px solid black;
    border-radius: 10px;
    padding: 5px;
    margin: 3px;
    appearance: none; 
    -webkit-appearance: none; 
    -moz-appearance: none; 
    outline: none;
    font-size: 100%;
}

select option {
    border: 1px solid black;
}

button {
    border: 1px solid black;
    border-radius: 10px;
    font-size: 100%;
    padding: 5px;

}

</style>
