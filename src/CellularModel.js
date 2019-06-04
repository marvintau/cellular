Array.prototype.last = function(){
    return this[this.length - 1];
}

Array.prototype.beforeLast = function(){
    return this[this.length - 2];
}

Array.prototype.most = function(){
    return this.slice(0, -1);
}

let data = {
    data: '',
    attr: {
        type: 'editable',
        style: 'cell'
    }
}

export function clone(obj){
    return Object.assign({}, obj);
}

function headCell(col){
    return {
        data: Number.isInteger(col) || isNaN(col) ? col : `col-${col}`,
        attr:{type: "label", style:"cell", default:clone(data)}
    }
}

function bodyCell(data){
    return {
        data: Number.isInteger(data) || isNaN(data) ? data : data.toFixed(2),
        attr:{type: "editable", style:"cell"}
    }
}

export function genGrid(cols, rows, cellFunc){
    return Array(rows).fill(0).map((_e, row) => Array(cols).fill(0).map((_e, col) => cellFunc(col, row)))
}

export function genHead(cols, headFunc){
    
    if (cols.constructor === Object) {
        let keys = Object.keys(cols);
        return genGrid(keys.length, 1, (col, row) => headCell(keys[col]))
    } else {
        headFunc = headFunc ? headFunc: headCell;
        return genGrid(cols, 1, headFunc);    
    }
}

export function genTable(cols, rows, headFunc){
    if (Array.isArray(cols) && cols.every(e => e.constructor === Object)){
        return cols.map(e => Object.values(e).map(c => bodyCell(c)));
    } else {
        headFunc = headFunc ? headFunc: headCell;
        return genGrid(cols, rows, bodyCell)
    }
}

function group(records, keyFunc){
    return records.reduce((accum, rec) => {
        let key = keyFunc(rec);
        accum[key] = accum[key] ? accum[key] : [];
        accum[key].push(rec);
        return accum;
    }, {})
}

export function cascade(balance, groupFunc, gatherFunc) {

    let groups = Object.values(group(balance, groupFunc));
    groups.reverse();

    for (var long = groups.shift(); groups.length > 0; long=groups.shift()) {

        while (long.length > 0){
            let entry = long.pop();
            for (let poss of groups[0]) if (gatherFunc(entry, poss)){
                    poss.children.push(entry);
            }
        }
    }
    return long;
}

export function flatten(cascade) {
    let res = [];
    for (let item of cascade) {
        res.push(...(item.children.length === 0 ? [item] : flatten(item.children)))
    }
    return res;
}

export function sort(table, key) {
    return table.sort((a, b) => a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0);
}