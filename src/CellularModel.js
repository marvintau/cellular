
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
        data: `col-${col}`,
        attr:{type: "label", style:"cell", default:clone(data)}
    }
}

function bodyCell(col, row){
    return {
        data: '',
        attr:{type: "editable", style:"cell", default:clone(data)}
    }
}

export function genGrid(cols, rows, cellFunc){
    return Array(rows).fill(0).map((_e, row) => Array(cols).fill(0).map((_e, col) => cellFunc(col, row)))
}

export function genHead(cols, headFunc){
    headFunc = headFunc ? headFunc: headCell;
    let headGrid = genGrid(cols, 1, headFunc);
    headGrid[0].push({data:'添加列', attr:{type:"button", style:"extra", handler:"addCol"}});

    return headGrid;
}

export function genTable(cols, rows, headFunc){
    headFunc = headFunc ? headFunc: headCell;
    return genGrid(cols, rows, bodyCell)
}