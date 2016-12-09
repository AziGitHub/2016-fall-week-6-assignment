console.log('6.1');

//First, append <svg> element and implement the margin convention
var m = {t:50,r:50,b:50,l:50};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',outerWidth)
    .attr('height',outerHeight)
    .append('g')
    .attr('transform','translate(' + m.l + ',' + m.t + ')');

//Import data and parse
d3.csv('../data/olympic_medal_count.csv',parse,dataLoaded);


function parse(d)
{
    return {
        Country:d['Country'],
        'count1900' :  +d['1900'],
        'count1960' : +d['1960'],
        'count2012' : +d[2012]
    }
}
function dataLoaded(err, data)
{
    var sortedByMedals=data.sort(function(b,a){
        return a.count2012 - b.count2012;
    }); //sort by a specific year

    sortedByMedals.splice(5); // cut all the items and keep only five
    // attach data to the d3 elements using data, enter and exit.

    //scale the data for the values of the bars

    var minY=d3.min(sortedByMedals,function(d){return d.count2012;});
    var maxY=d3.max(sortedByMedals,function(d){return d.count2012;});


    var scaleY=d3.scaleLinear()
        .domain([0,maxY])
        .range([0,h]);


    var scaleAxisY=d3.scaleLinear()
    .domain([0,maxY])
    .range([h,0]);

    var colorScale=d3.scaleLinear()
        .domain([0,4])
        .range(['black','gray']);

    var scaleX=d3.scaleLinear()
        .domain([0,4])
        .range([100,500]);

    var bars=plot.selectAll(".theBars")
        .data(sortedByMedals)
        .enter()
        .append("g")    //appending a group
        .attr('class',function(d){return d.Country})
        .append("rect") //appending a rect to the group
        .attr("width","30") //defining width of each rect
        .attr("height",function(d){return scaleY(d.count2012)})
        .attr("class","clsRect")    //adding a class of clsRect for the future usage
        .attr("x",function(d,i){return scaleX(i)-15})   //pushing each rect to the right (and 15px to the left)
        .attr("y",function(d){return h-scaleY(d.count2012)})    //bringing down the rects to make them bar
        .attr('fill',function(d,i){return colorScale(i)}); //filling with color scale

    //Represent: axis
    var axisX = d3.axisBottom()
        .scale(scaleX)
        .ticks(5)
        .tickFormat(function(d) { return sortedByMedals[d].Country; });
    var axisY = d3.axisLeft()
        .scale(scaleAxisY);

    plot.append('g').attr('class','axis axis-x')
        .attr('transform','translate(0,'+h+')')
        .call(axisX);

    plot.append('g')
        .attr('class','y axis')
        .attr("transform",'translate(60,0)')
        .call(axisY);


}