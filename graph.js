queue()
.defer(d3.json,"data/transactions.json")
.await(makePie);

function makePie(error,transactionsData){
    let ndx = crossfilter(transactionsData)
    
    
    
  let nameDim= ndx.dimension(dc.pluck("name"));
        //   let statepDim=ndx.dimension(function(d){
        //       return d.state;
        //   })
          let totalSpendByName = nameDim.group().reduceSum(dc.pluck("spend"));
            
            dc.pieChart("#statechart")
            .height(300)
            .radius(100)
            .dimension(nameDim)
            .group(totalSpendByName)
 
}

queue()
.defer(d3.json,"data/transactions.json")
.await(makeGraph);

function makeGraph(error,transactionsData){
    let ndx = crossfilter(transactionsData)






                    // COMPOSITE GRAPH
let parseDate = d3.time.format("%d/%m/%Y").parse;
transactionsData.forEach(function(d) {
    d.date= parseDate(d.date);
})

let dateDim = ndx.dimension(dc.pluck("date"));

var minDate=dateDim.bottom(1)[0].date;
var maxDate=dateDim.top(1)[0].date;

// 
let tomSpend = dateDim.group().reduceSum(
    function(d){
        if (d.name ==="Tom"){
            return +d.spend;
        } else{
            return 0;
        }
    })
    
    let aliceSpend = dateDim.group().reduceSum(
    function(d){
        if (d.name ==="Alice"){
            return +d.spend;
        } else{
            return 0;
        }
    })

let bobSpend = dateDim.group().reduceSum(
    function(d){
        if (d.name ==="Bob"){
            return +d.spend;
        } else{
            return 0;
        }
        
    })
    let avgSpend = dateDim.group().reduceSum(
        function(d){
            return +d.spend / 3
        })
        
        
        
 let compositeChart = dc.compositeChart
 ("#compositeChart")
 
 compositeChart
 .width(1000)
 .height(200)
 .dimension(dateDim)
 .x(d3.time.scale().domain([minDate,maxDate]))
 .yAxisLabel("Spend")
 .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
 .renderHorizontalGridLines(true)
 .compose([
     dc.lineChart(compositeChart)
     .colors("green")
     .group(tomSpend,"Tom"),
     dc.lineChart(compositeChart)
     .colors("red")
     .group(bobSpend,"Bob"),
     dc.lineChart(compositeChart)
     .colors("blue")
     .group(aliceSpend,"alice"),
     dc.lineChart(compositeChart)
     .colors("black")
     .group(avgSpend,"Average")
     ])
     .render()//render = renders the info above into a line chart
     .yAxis().ticks(8); 
     dc.renderAll(); // renderAll actually then renders the composite chart
     
}

// we use crossfilter to create our dimensions and groups, it gives us interaction with our dc. if we dont use crossfilter we have to use dc. or else we use d3 and lose the interaction