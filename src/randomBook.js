const PERIOD = 6;


Array.prototype.randomChoice = function(range){

    range = range ? range : 1;
    let choice = Math.ceil(Math.random() * this.length * range);
    return choice >= this.length ? "missed" : this[choice];
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

    let entry = {ccode, period, mb, mc, md, me};

    return entry;
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

export function createRandomJournal(rootCategoryNumber=10, periods=PERIOD){

    let state = initialState(rootCategoryNumber);

    let journal = [];

    for (let period = 0; period < periods; period++){
        let {state: newState, journal: newJournal} = randomPeriodJournal(state, period);
        state = newState;
        journal.push(...newJournal);
    }

    return journal;
}
