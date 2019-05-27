Array.prototype.last = function(){
    return this[this.length - 1];
}

Array.prototype.beforeLast = function(){
    return this[this.length - 2];
}

Array.prototype.most = function(){
    return this.slice(0, -1);
}

Array.prototype.randomChoice = function(range){

    range = range ? range : 1;

    let choice = Math.ceil(Math.random() * this.length * range);
        
    return choice >= this.length ? "missed" : this[choice];
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
    return genGrid(cols, 1, headFunc);
}

export function genTable(cols, rows, headFunc){
    headFunc = headFunc ? headFunc: headCell;
    return genGrid(cols, rows, bodyCell)
}


function randomAlphabet(){
    let random = Math.ceil(Math.random() * 26 + 96);
    return String.fromCharCode(random);
}

function randomWord(len){
    let res = "";
    for (let i = 0; i < len; i++){
        res = res + randomAlphabet();
    }
    return res;
}

function randomCategory(len) {

    let table = [];
        
    while (table.filter(e => e.length === 4).length < len){
        let choice = table.randomChoice(1.3);        
        table.push(choice !== "missed" ? choice + randomWord(2) : randomWord(4))
    }

    return table.sort();
}


function leafCates(category){
    return category.filter(curr =>
        category.every(other => other === curr || !other.includes(curr))
    );
}

function initialState(len){
      
    len = len ? len : 20;

    let category = randomCategory(len);
    let state = {};

    for (let k of category){
        state[k] = 0;
    }

    let leafCategories = leafCates(category);
    for (let leaf of leafCategories){
        let amount = Math.random() * 10000;
        for(let i = 4; i <= leaf.length; i+=2){
            state[leaf.slice(0, i)] += amount;
        }
    }

    return state;
}

let state = initialState(10);

function randomEntry(state, leaf, period){

    let ccode = leaf;

    if(ccode === 'missed'){
        console.log('missed');
    }

    let mb = state[ccode],
        mc = Math.random()*100,
        md = Math.random()*100,
        me = mb + mc - md;

    return {ccode, period, mb, mc, md, me};
}

function randomPeriodJournal(state, period, len){

    if (period === 0){
        return { state,
            journal: Object.entries(state).map(([k, v]) => ({
            ccode: k, period: 0,
            mb: 0, mc: 0, md: 0, me: v}))
        }
    }

    len = len ? len : 10;

    let leafs = leafCates(Object.keys(state)),
        journal = [];

    for (let i = 0; i < len; i++){
        let chosen = leafs.randomChoice();
        if(chosen === 'missed') continue;
        
        let entry = randomEntry(state, chosen, period);
        state[entry.ccode] = entry.me;    
        journal.push(entry);
    }

    return {state, journal};
}

const PERIOD = 6;

function randomJournal(state, periods=PERIOD){

    let journal = [];

    for (let period = 0; period < periods; period++){
        let {state: newState, journal: newJournal} = randomPeriodJournal(state, period);
        state = newState;
        journal.push(...newJournal);
    }

    return journal;
}

let journal = randomJournal(state);

function uniq(records){
    records.sort();
    for (let i = 0; i < records.length-1; i++){
        if(records[i].ccode === records[i+1] && records[i].me === records[i+1].me) {
            records.splice(i, 1);
        }
    }

    return records;
}

function group(records, keyFunc){
    return records.reduce((accum, rec) => {
        let key = keyFunc(rec);
        accum[key] = accum[key] ? accum[key] : [];
        accum[key].push(rec);
        return accum;
    }, {})
}

function periodicalBalance(journal, period=PERIOD){
    
    let grouped = group(journal, (e) => e.ccode);

    // summary the balance in different period
    for (let ccode in grouped){
        let [first, ...rest] = grouped[ccode];
        grouped[ccode] = rest.reduce((accum, rec) => {
            let last = accum.last();
            if (last.period === rec.period){
                last.mc += rec.mc;
                last.md += rec.md;
                last.me =  rec.me;
                return accum;
            } else {
                return accum.concat(rec);
            }
        }, [first]);
    }

    for (let ccode in grouped){
        let entry = grouped[ccode];

        for(let i = 1; i < period; i++) {
            if (entry.filter(e => e.period === i).length === 0){
                let last = entry[i-1];
                entry.splice(i, 0, Object.assign({}, last, {period:i, mb:last.me, mc:0, md:0, me:last.me}))
            }
        }
    }

    let ungrouped = [];
    for (let ccode in grouped) {
        ungrouped.push(...grouped[ccode]);
    }
    
    return group(ungrouped, (e) => e.period);
}

let balances = periodicalBalance(journal);

function hierarchy(balance) {

    let groups = Object.values(group(balance, (e) => e.ccode.length));
    groups.reverse();

    let [longest, ...rest] = groups;

    while (rest.length > 0) {
        let lessLongest = rest.shift();

        while (longest.length > 0){
            let entry = longest.pop();
            for (let less of lessLongest)
                if (less.ccode.includes(entry.ccode))
                    // less.children && less.children.push(entry) || less.children = [entry];
                    less.children = less.children ? less.children.concat(entry) : [entry];
        }

        longest = lessLongest;
    }

    return longest;
}

console.log(balances);
console.log(hierarchy(balances[0]));