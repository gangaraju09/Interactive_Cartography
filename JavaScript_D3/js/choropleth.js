//document.getElementById("myOutput").innerHTML = getExpressedValue();

(function(){

//pseudo-global variables
var  attrArray = ["Population", "Crime", "GDP", "Poverty", "Literacy"]; //list of attributes
var expressed = attrArray[1]; //initial attribute

var chartWidth = window.innerWidth * 0.425,
    chartHeight = 473,
    leftPadding = 25,
    rightPadding = 2,
    topBottomPadding = 5,
    chartInnerWidth = chartWidth - leftPadding - rightPadding,
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

var yScale = d3.scaleLinear()
.range([463, 0])
.domain([0, 1.5]);


//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){

    document.getElementById('h1').innerHTML =  'The Impact of Socioeconomics on Crime Rates in the USA'; 
    

//map frame dimensions
var width = window.innerWidth * 0.48,
height = 473;

//create new svg container for the map
var map = d3.select("body")
    .append("svg")
    .attr("class", "map")
    .attr("width", width)
    .attr("height", height);

//create Albers equal area conic projection centered on USA
var projection = d3.geoAlbersUsa()
    .scale(800)
    .translate([width / 2, height / 2]);;

var path = d3.geoPath()
    .projection(projection);

//use Promise.all to parallelize asynchronous data loading
var promises = [];    
promises.push(d3.csv("data/crime_data.csv"));
promises.push(d3.json("data/usa_shape.topojson"));

Promise.all(promises).then(callback);    

function callback(data){    
    csvData = data[0];    
    usa = data[1];

//setGraticule(map,path);

//translate europe TopoJSON
var usa_state = topojson.feature(usa, usa.objects.usa).features;
console.log(usa_state)

    //add Europe countries to map
// var countries = map.append("path")
//.datum(usa_state)
//.attr("class", "countries")
//.attr("d", path);

usa_state = joinData(usa_state, csvData);

//create the color scale
var colorScale = makeColorScale(csvData);

//add enumeration units to the map
setEnumerationUnits(usa_state, map, path, colorScale);

//add coordinated visualization to the map
setChart(csvData, colorScale);

//add dropdown
createDropdown(csvData);

// add color legend
makeLegend(colorScale);

}
}
/*function setMap(){

//map frame dimensions
var width = 960,
height = 500;

//create new svg container for the map
var map = d3.select("body")
    .append("svg")
    .attr("class", "map")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

//use Promise.all to parallelize asynchronous data loading
var promises = [d3.csv("data/crime_data.csv"),                    
                d3.json("/d/4090846/us.json")                  
                ];    
Promise.all(promises).then(callback);    

function callback(data){    
    csvData = data[0];    
    usa = data[1];

    // insert land and county boundaries
    map.insert("path", ".graticule")
        .datum(topojson.feature(usa, usa.objects.land))
        .attr("class", "land")
        .attr("d", path);

    map.insert("path", ".graticule")
        .datum(topojson.mesh(usa, usa.objects.counties, function(a, b) { return a !== b && !(a.id / 1000 ^ b.id / 1000); }))
        .attr("class", "county-boundary")
        .attr("d", path);

    // insert state boundaries
    map.insert("path", ".graticule")
        .datum(topojson.mesh(usa, usa.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "state-boundary")
        .attr("d", path);

    // insert composition borders
    map.append("path")
        .style("fill","none")
        .style("stroke","#000")
        .attr("d", projection.getCompositionBorders());

    // transform data to fit the new projection
    var usa_state = topojson.feature(usa, usa.objects.states).features;
    usa_state.forEach(function(d) {
        var centroid = path.centroid(d);
        d.x0 = centroid[0];
        d.y0 = centroid[1];
    });

    //create the color scale
    var colorScale = makeColorScale(csvData);

    //add enumeration units to the map
    setEnumerationUnits(usa_state, map, path, colorScale);

    //add coordinated visualization to the map
    setChart(csvData, colorScale);
}
    
}*/



//function to create color scale generator
function makeColorScale(data){
var colorClasses = [
    /*/"#ccdbdc",
    "#ffceff",
    //"#9ad1d4",
    "#ffb7ff",
    "#c879ff",
    "#a564d3"*/

    //"#caf0f8","#90e0ef","#0096c7","#023e8a"
    //"#e8f3fe","#77b6fb","#1557c0","#0f3375"
    //"#eef6fc","#97caed","#3498db","#185d8b"
    "#eff3ff","#bdd7e7","#6baed6","#3182bd"






];

//create color scale generator
var colorScale = d3.scaleQuantile()
    .range(colorClasses);

//build array of all values of the expressed attribute
var domainArray = [];
for (var i=0; i<data.length; i++){
    var val = parseFloat(data[i][expressed]);
    domainArray.push(val);
};

//assign array of expressed values as scale domain
colorScale.domain(domainArray);

return colorScale;

};
/*
function setGraticule(map,path){
var graticule = d3.geoGraticule().step([5, 5]); //place graticule lines every 5 degrees of longitude and latitude

    //create graticule background
    var gratBackground = map
        .append("path")
        .datum(graticule.outline()) //bind graticule background
        .attr("class", "gratBackground") //assign class for styling
        .attr("d", path); //project graticule

    //create graticule lines
    var gratLines = map
        .selectAll(".gratLines") //select graticule elements that will be created
        .data(graticule.lines()) //bind graticule lines to each element to be created
        .enter() //create an element for each datum
        .append("path") //append each element to the svg as a path element
        .attr("class", "gratLines") //assign class for styling
        .attr("d", path); //project graticule lines */

function joinData(usa_state,csvData){
//loop through csv to assign each set of csv attribute values to geojson region
    //loop through csv to assign each set of csv attribute values to geojson region
    for (var i=0; i<csvData.length; i++){
    var csvRegion = csvData[i]; //the current region
    var csvKey = csvRegion.STATEFP; //the CSV primary key

    //loop through geojson regions to find correct region
    for (var a=0; a<usa_state.length; a++){

        var geojsonProps = usa_state[a].properties; //the current region geojson properties
        var geojsonKey = geojsonProps.STATEFP; //the geojson primary key

        //where primary keys match, transfer csv data to geojson properties object
        if (geojsonKey === csvKey){

            //assign all attributes and values
            attrArray.forEach(function(attr){
                var val = parseFloat(csvRegion[attr]); //get csv attribute value
                geojsonProps[attr] = val; //assign attribute and value to geojson properties
            });
            csvRegion.STATEFP = geojsonProps.STATEFP;
        };
    };
};
    console.log(usa_state)
    return usa_state;
}  

/*/function to create coordinated bar chart
function setChart(csvData, colorScale){
//chart frame dimensions
var chartWidth = window.innerWidth * 0.425,
    chartHeight = 473,
    leftPadding = 25,
    rightPadding = 2,
    topBottomPadding = 5,
    chartInnerWidth = chartWidth - leftPadding - rightPadding,
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

//create a second svg element to hold the bar chart
var chart = d3.select("body")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .attr("class", "chart");

//create a rectangle for chart background fill
var chartBackground = chart.append("rect")
    .attr("class", "chartBackground")
    .attr("width", chartInnerWidth)
    .attr("height", chartInnerHeight)
    .attr("transform", translate);

//create a scale to size bars proportionally to frame and for axis
var yScale = d3.scaleLinear()
    .range([463, 0])
    .domain([0, 100]);

//set bars for each province
var bars = chart.selectAll(".bar")
    .data(csvData)
    .enter()
    .append("rect")
    .sort(function(a, b){
        return b[expressed]-a[expressed]
    })
    .attr("class", function(d){
        return "bar " + d.STATEFP;
    })
    .attr("width", chartInnerWidth / csvData.length - 1)
    .attr("x", function(d, i){
        return i * (chartInnerWidth / csvData.length) + leftPadding;
    })
    .attr("height", function(d, i){
        return 463 - yScale(parseFloat(d[expressed]));
    })
    .attr("y", function(d, i){
        return yScale(parseFloat(d[expressed])) + topBottomPadding;
    })
    .style("fill", function(d){
        return colorScale(d[expressed]);
    });

//create a text element for the chart title
var chartTitle = chart.append("text")
    .attr("x", 40)
    .attr("y", 40)
    .attr("class", "chartTitle")
    .text("Number of Variable " + expressed[3] + " in each region");

//create vertical axis generator
var yAxis = d3.axisLeft()
    .scale(yScale);

//place axis
var axis = chart.append("g")
    .attr("class", "axis")
    .attr("transform", translate)
    .call(yAxis);

//create frame for chart border
var chartFrame = chart.append("rect")
    .attr("class", "chartFrame")
    .attr("width", chartInnerWidth)
    .attr("height", chartInnerHeight)
    .attr("transform", translate);

};*/

//function to create coordinated lollipop chart
function setChart(csvData, colorScale){
// create chart dimensions
var chartWidth = window.innerWidth * 0.425,
    chartHeight = 480,
    leftPadding = 20,
    rightPadding = 0.5,
    topBottomPadding = 5,
    chartInnerWidth = chartWidth - leftPadding - rightPadding,
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

//create a second svg element to hold the bar chart
var chart = d3.select("body")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .attr("class", "chart");

//create a rectangle for chart background fill
var chartBackground = chart.append("rect")
    .attr("class", "chartBackground")
    .attr("width", chartInnerWidth)
    .attr("height", chartInnerHeight)
    .attr("transform", translate);

//create a scale to size bars proportionally to frame and for axis
var yScale = d3.scaleLinear()
    .range([463, 0])
    .domain([0, 0.6]);

// set lines for each province
var myline = chart.selectAll(".myline")
    .data(csvData)
    .enter()
    .append("rect")
    .style("stroke", "black")
    .style("stroke-width", "1")
    .attr("class", function(d){
        return "myline id" + d.STATEFP;
    })
    .attr("width", "0.5")
    .attr("x", function(d, i){
        return i * (chartInnerWidth / csvData.length) + (leftPadding + 2.75);
    })
    .attr("y", function(d, i){
        return yScale(parseFloat(d[expressed])) + topBottomPadding;
    })
    .attr("height", function(d, i){
        console.log("Dot plot value",expressed)
        return 463 - yScale(parseFloat(d[expressed]));
    
    })
    .on("mouseover", function (event, d) {
        highlight(d);
    })
    .on("mouseout", function (event, d) {
        dehighlight(d);
    })
    .on("mousemove", moveLabel);
    var desc = myline.append("desc").text('{"stroke": "black", "stroke-width": "1px"}');
   
// circles
var mycircle = chart.selectAll(".mycircle")
    .data(csvData)
    .join("circle")
    .attr("cx", function(d,i){
        var xPosition = i * (chartInnerWidth / csvData.length) + leftPadding + ((chartInnerWidth / csvData.length) / 2)
        return (xPosition-2);  
    })
    .attr("cy", function(d){
        return yScale(parseFloat(d[expressed])) + topBottomPadding;
    })
    .attr("r", "6")
    .style("fill", function(d){
        return colorScale(d[expressed])
    })
    .attr("stroke", "#636363")

    .on("mouseover", function(event, d){
        highlight(d);
    })
    .on("mouseout", function(event, d){
        dehighlight(d);
    })
    .on("mousemove", moveLabel);

    var desc2 = mycircle.append("desc")
     .text('{"stroke": "#000", "stroke-width": "2px"}');

    
    
//create a text element for the chart title
var chartTitle = chart.append("text")
    .attr("x", 40)
    .attr("y", 30)
    .attr("class", "chartTitle")
    .text("Crime Rate "  /*expressed[2]*/ + " in each USA State");

/*/ create X axis label
var chartXtitle = chart.append("text")
    .attr("class", "x axis-label")
    .attr("text-anchor", "middle")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + 10)
    .text("USA_States");

// create Y axis label
var chartYtitle = chart.append("text")
    .attr("class", "y axis-label")
    .attr("text-anchor", "middle")
    .attr("x", -chartInnerHeight / 2)
    .attr("y", 10)
    .attr("transform", "rotate(-90)")
    .text("State_Value");*/


//create vertical axis generator
var yAxis = d3.axisLeft()
    .scale(yScale);

//place axis
var axis = chart.append("g")
    .attr("class", "axis")
    .attr("transform", translate)
    .call(yAxis);

//create frame for chart border
var chartFrame = chart.append("rect")
    .attr("class", "chartFrame")
    .attr("width", chartInnerWidth)
    .attr("height", chartInnerHeight)
    .attr("transform", translate);



// set line & circle positions, heights, and colors
updateChart(myline, mycircle, csvData.length, colorScale);
};


function setEnumerationUnits(usa_state,map,path,colorScale){
//add usa regions to map
var regions = map.selectAll(".regions")
    .data(usa_state)
    .enter()
    .append("path")
    .attr("class", function(d){
        return "regions id" + d.properties.STATEFP;
    })
    .attr("d", path)
    .style("fill", function(d){
        var value = d.properties[expressed];
        if(value) {
            return colorScale(d.properties[expressed]);
        } else {
            return "#ccc";
        }
    })
    .on("mouseover", function (event, d) {
        highlight(d.properties);
    })
    .on("mouseout", function (event, d) {
        dehighlight(d.properties);
    })
    .on("mousemove", moveLabel);

var desc = regions.append("desc").text('{"stroke": "#000", "stroke-width": "1px"}');
        
}

//function to create a dropdown menu for attribute selection
function createDropdown(csvData) {
//add select element
var left = document.querySelector('.map').getBoundingClientRect().left + 8,
        top = document.querySelector('.map').getBoundingClientRect().top + 6;
        bottom = document.querySelector('.map').getBoundingClientRect().bottom;

var dropdown = d3.select("body")
            .append("select")
            .attr("class", "dropdown")
            .style("left", left + "px")
            .style("top", top + "px")
            .on("change", function(){
                changeAttribute(this.value, csvData)
            });


//add initial option
var titleOption = dropdown
    .append("option")
    .attr("class", "titleOption")
    .attr("disabled", "true")
    .text("Select Attribute");

//add attribute name options
var attrOptions = dropdown
    .selectAll("attrOptions")
    .data(attrArray)
    .enter()
    .append("option")
    .attr("value", function (d) {
        return d;
    })
    .text(function (d) {
        return d;
    });
    };

//dropdown change listener handler
function changeAttribute(attribute, csvData) {
//change the expressed attribute
expressed = attribute;
console.log("Expressed in changeAttribute function :", expressed);

//recreate the color scale
var colorScale = makeColorScale(csvData);

//recolor enumeration units
var regions = d3.selectAll(".regions")
    .transition()
    .duration(1000)
    .style("fill", function (d) {
        var value = d.properties[expressed];
        if (value) {
            return colorScale(value);
        } else {
            return "#ccc";
        }
    });

// set lines for each state
var myline = d3.selectAll(".myline")
d3.select(".legend").remove();
makeLegend(colorScale);

// circles
var mycircle = d3.selectAll("circle")
d3.select(".legend").remove();
makeLegend(colorScale);

var domainArray = []
for (var i=0; i<csvData.length; i++){
    var val = parseFloat(csvData[i][expressed]);
    domainArray.push(val)
};
var max = d3.max(domainArray);

yScale = d3.scaleLinear()
    .range([463, 0])
    .domain([0, max+(0.1*max)]);

var yAxis = d3.axisLeft()
    .scale(yScale);

d3.select(".axis").call(yAxis)


// set line & circle positions, heights, and colors
updateChart(myline, mycircle, csvData.length, colorScale);

}

//function to position, size, and color lines in chart
function updateChart(myline, mycircle, n, colorScale){
console.log("updateChart expressed: ", expressed)

//position lines
myline.attr("x", function(d, i){
    return i * (chartInnerWidth / csvData.length) + (leftPadding + 2.75);
    })
    // resize lines
    .attr("y", function(d, i){
        return yScale(parseFloat(d[expressed])) + topBottomPadding;
    })
    .attr("height", function(d, i){
        return 463 - yScale(parseFloat(d[expressed]));
    })

// position circles
mycircle.attr("cx", function(d, i) {
    return ((i * (chartInnerWidth / n) + leftPadding + ((chartInnerWidth / n) / 2))-2.5);
    })
    .attr("cy", function(d){
        return yScale(parseFloat(d[expressed])) + topBottomPadding;
    })
    .attr("r", "4")
    // recolor circles
    .style("fill", function(d){            
        var value = d[expressed];            
        if(value) {                
            return colorScale(value);            
        } else {                
            return "#ccc";            
        }  
    })
    .attr("stroke", "#636363");

//at the bottom of updateChart()...add text to chart title
var chartTitle = d3
    .select(".chartTitle")
    .style("font-family", "sans-serif")
    .style("color", "#fff")
    .text("Rate of "+expressed + " per state across USA");
}

//function to highlight enumeration units and bars
function highlight(props) {
    //change stroke
    var selected = d3
        .selectAll(".id" + props.STATEFP)
        .style("stroke", "#fff")
        .style("stroke-width", "3");
    setLabel(props);


}

//function to reset the element style on mouseout
function dehighlight(props) {
    var selected = d3
        .selectAll(".id" + props.STATEFP)
        .style("stroke", function () {
            return getStyle(this, "stroke");
        })
        .style("stroke-width", function () {
            return getStyle(this, "stroke-width");
        });

    function getStyle(element, styleName) {
        var styleText = d3.select(element).select("desc").text();

        var styleObject = JSON.parse(styleText);

        return styleObject[styleName];
    }
    //remove info label
    d3.select(".infolabel").remove();
}

//function to create dynamic label
function setLabel(props) {
    console.log("here!");
    //label content
    var labelAttribute = "<h1>" + props[expressed] + "</h1><b>" + expressed + "</b>";

    //create info label div
    var infolabel = d3
        .select("body")
        .append("div")
        .attr("class", "infolabel")
        .attr("id", props.NAME + "_label")
        .html(labelAttribute);

    var regionName = infolabel.append("div").attr("class", "labelname").html(props.NAME);
    console.log('State Name:',regionName)
}

//function to move info label with mouse
function moveLabel() {
    //get width of label
    var labelWidth = d3.select(".infolabel").node().getBoundingClientRect().width;

    //use coordinates of mousemove event to set label coordinates
    var x1 = event.clientX + 10,
    y1 = event.clientY - 75,
    x2 = event.clientX - labelWidth - 10,
    y2 = event.clientY + 25;

    //horizontal label coordinate, testing for overflow
    var x = event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1;
    //vertical label coordinate, testing for overflow
    var y = event.clientY < 75 ? y2 : y1;

    d3.select(".infolabel")
        .style("left", x + "px")
        .style("top", y + "px");
}

// code from Stackoverflow
function makeLegend(color) {
    var width = 200,
        height = 300;
        topBottomPadding = 5;
    
    var right = document.querySelector("body").getBoundingClientRect().right,
        bottom = document.querySelector("body").getBoundingClientRect().bottom;

    var svg = d3.select("body")
        .append("svg")
        .attr("class", "legend")
        .attr("width", width)
        .attr("height", height)
        .style("right", right )
        .style("bottom", bottom);

    var legend = svg.selectAll('g.legendEntry')
        .data(color.range().reverse())
        .enter()
        .append('g').attr('class', 'legendEntry')
        .style("float", 'right');

    legend.append('rect')
        .style("float", 'right')
        .attr("x", width - 200)
        .attr("y", function (d, i) {
            return i * 20;
        })
        .attr("width", 30)
        .attr("height", 22)
        .style("stroke", "white")
        .style("stroke-width", 0.5)
        .style("fill", function (d) { return d; });

    //the data objects are the fill colors
    legend.append('text')
        .attr("x", width - 165) //leave 5 pixel space after the <rect>
        .attr("y", function (d, i) {
            return i * 22.5;
        })
        .attr("dy", "0.8em") //place text one line *below* the x,y point
        .text(function (d, i) {
            var extent = color.invertExtent(d);
            //extent will be a two-element array, format it however you want:
            var format = d3.format("0.2f");
            return format(+extent[0]) + " - " + format(+extent[1]);
        })
};

/* document.getElementById('.credits').innerHTML = "<p> <b>Gross Domestic Product (GDP)</b> is the total value of goods and services produced within a country's borders in a given period of time, used as an economic indicator for a country's economic performance. | "+ " "+ " Data Source: <a href = 'https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG'> World Bank Data </a> | "+ " "+ "Credits: Gareth Baldrica-Franklin, RCS Sidhharth</p>" */

})();


