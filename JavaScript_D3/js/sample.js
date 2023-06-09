(function(){

    //pseudo-global variable    
    var attrArray = ["Population", "Crime Rate", "GDP Percentage", "Poverty Rate", "Literacy Rate"];
    
    var arrayDict = {"Population" : "Population",	"Crime Rate":"Crime Rate",	"GDP Percentage":"GDP Percentage",	"Poverty Rate":"Poverty Rate",	"Literacy Rate":"Literacy Rate"};
    
    var arrayObj = [{data:"Population", text:"Total persons"}, {data:"Crime Rate", text:"crime rate"}, {data:"GDP Percentage", text:"GDP Percentage"}, {data:"Poverty Rate", text:"Poverty Rate"}, {data:"Literacy Rate", text:"Literacy Rate"}];
    
    var expressed = attrArray[4]; // loaded attribute based on index
    
    // create chart dimensions
    var chartWidth = window.innerWidth * 0.425,
    chartHeight = 473,
    leftPadding = 25,
    rightPadding = 2,
    topBottomPadding = 5,
    chartInnerWidth = chartWidth - leftPadding - rightPadding,
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";
    
    // create a scale to size lines proportionally to frame and for axis
    var yScale = d3.scaleLinear()
    .range([463, 0])
    .domain([0, 100]);
    
    window.onload = setMap();
    
    // setup a choropleth map
    function setMap(){
        // map frame dimensions
        var width = window.innerWidth * 0.48,
            height = 473;
    
        // create new svg container for the map
        var map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);
    
        // create Albers equal area conic projection centered on Wisconsin
        var projection = d3.geoAlbersUsa()
            .scale(800)
            .translate([width / 2, height / 2]);;

        var path = d3.geoPath()
            .projection(projection); // path holds projection and helps in rendering the projection
    
        // promises container is created to hold the promise
        var promises = [];
    
        // d3.csv(), d3.json() methods read csv, topojson files
        promises.push(d3.csv("data/crime_data.csv"));
        promises.push(d3.json("data/usa_shape.topojson"));
    
        // Promise helps to load the data asynchronously
        // bind the output into callback function
        Promise.all(promises).then(callback);
    
        // callback reads the output response of promises (read files - csv, topojson)
        // retrieves the file information
        function callback(data){
            var csvData = data[0], wisconsin = data[1];
    
            // place graticule on the map
            // setGraticule(map,path);
    
            // testing whether the files are loaded correctly or not
            console.log("CSV data below",csvData);
            console.log("TopoJSON data below",wisconsin);
    
            // translate Wisconsin counties from topojson to geojson
            var wisconsinCounties = topojson.feature(wisconsin, wisconsin.objects.tl_2022_us_state).features;
    
            // join data of Wisconsin counties
            wisconsinCounties = joinData(wisconsinCounties,csvData);
    
            // create a colorscale
            var colorScale = makeColorScale(csvData);
    
            // add enumeration units to the map
            setEnumerationUnits(wisconsinCounties, map, path, colorScale)
    
            // add dropdown to the map
            createDropdown(csvData);
    
            // add dotplot visualization to the map
            setDotPlot(csvData, colorScale);
           
        };
    };
    
    function createDropdown(csvData){
        //add select element
        var dropdown = d3.select("body")
            .append("select")
            .attr("class", "dropdown")
            .on("change", function(){
                changeAttribute(this.value, csvData)
            });
    
        //add initial option
        var titleOption = dropdown.append("option")
            .attr("class", "titleOption")
            .attr("disabled", "true")
            .text("Select Attribute");
    
        //add attribute name options
        var attrOptions = dropdown.selectAll("attrOptions")
            .data(arrayObj)
            .enter()
            .append("option")
            .attr("value", function(d){ return d.data })
            .text(function(d){ return d.text });
    };
    
   /* function setGraticule(map,path){
            // create graticule generator
            var graticule = d3.geoGraticule()
                .step([2, 2]); //place graticule lines every 1 degree of longitude and latitude
            
            // create graticule background
            var gratBackground = map.append("path") 
                .datum(graticule.outline()) // bind graticule background
                .attr("class", "gratBackground") // assign class for styling
                .attr("d", path) // project graticule
    
            // create graticule lines
            var gratLines = map.selectAll(".gratLines")  // select graticule elements that will be created
                .data(graticule.lines()) // bind graticule lines to each element to be created
                .enter() // create an element for each datum
                .append("path") // append each element to the svg as a path element
                .attr("class", "gratLines") // assign class for styling
                .attr("d", path); // project graticule lines
    };*/
    
    function joinData(wisconsinCounties, csvData){
        //loop through csv to assign each set of csv attribute values to geojson region
        for (var i=0; i<csvData.length; i++){
            var csvRegion = csvData[i]; //the current region
            var csvKey = csvRegion.STATEFP; //the CSV primary key
    
            //loop through geojson regions to find correct region
            for (var a=0; a<wisconsinCounties.length; a++){
    
            var geojsonProps = wisconsinCounties[a].properties; //the current region geojson properties
            var geojsonKey = geojsonProps.STATEFP; //the geojson primary key
    
            //where primary keys match, transfer csv data to geojson properties object
            if (geojsonKey == csvKey){
    
                //assign all attributes and values
                attrArray.forEach(function(attr){
                    var val = parseFloat(csvRegion[attr]); //get csv attribute value
                    geojsonProps[attr] = val; //assign attribute and value to geojson properties
                });
            };
            };
        };
        console.log("GeoJSON info below", wisconsinCounties)
        return wisconsinCounties
        
    };
    //function to create color scale generator
    function makeColorScale(data){
        var colorClasses = [
            "#ffffcc",
            "#c2e699",
            "#78c679",
            "#31a354",
            "#006837"
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
    
    function setEnumerationUnits(wisconsinCounties, map, path, colorScale){
    
         // add Wisconsin to map
        var state = map.selectAll(".counties")
          .data(wisconsinCounties)
          .enter()
          .append("path")
          .attr("class", function(d){
            // console.log(d.properties.NAME)
              return "counties " + d.properties.STATEFP;
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
        .on("mouseover", function(event, d){
            highlight(d.properties);
        });
    };
    
    //function to create coordinated bar chart
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
            .domain([0, 0.6]);
    
        //set bars for each province
        var bars = chart.selectAll(".bar")
            .data(csvData)
            .enter()
            .append("rect")
            .sort(function(a, b){
                return parseFloat(b[expressed])-parseFloat(a[expressed])
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
            .text(arrayDict[expressed]);
    
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
    };
    
    // function to create coordinated lollipop chart
    // source URL - https://d3-graph-gallery.com/graph/lollipop_basic.html
    function setDotPlot(csvData, colorScale){
        // create chart dimensions
        var chartWidth = window.innerWidth * 0.425,
            chartHeight = 473,
            leftPadding = 20,
            rightPadding = 0.5,
            topBottomPadding = 5,
            chartInnerWidth = chartWidth - leftPadding - rightPadding,
            chartInnerHeight = chartHeight - topBottomPadding * 2,
            translate = "translate(" + leftPadding + "," + topBottomPadding + ")";
    
        // create a second svg element to hold the bar chart
        var chart = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");
    
         // create a rectangle for chart background fill
         var chartBackground = chart.append("rect")
         .attr("class", "chartBackground")
         .attr("width", chartInnerWidth)
         .attr("height", chartInnerHeight)
         .attr("transform", translate);
    
        // create a scale to size lines proportionally to frame and for axis
        var yScale = d3.scaleLinear()
            .range([463, 0])
            .domain([0, 0.6]);
    
        // set lines for each county
        var lines = chart.selectAll(".line")
            .data(csvData)
            .enter()
            .append("rect")
            .attr("class", function(d){
                return "line " + d.STATEFP;
            })
            .attr("width", "0.5")
            .attr("x", function(d, i){
                return i * (chartInnerWidth / csvData.length) + (leftPadding+2.75)
            })
            .attr("y", function(d, i){
                console.log("Dot plot value",expressed)
                return yScale(parseFloat(d[expressed])) + topBottomPadding;
            })
            .attr("height", function(d, i){
                return 463 - yScale(parseFloat(d[expressed]));
            })
            .on("mouseover", function(event, d){
                highlight(d);
            });
    
         // circles
         var circles = chart.selectAll(".circle")
            .data(csvData)
            .join("circle")
            .attr("cx", function(d, i) {
                var xPosition =  i * (chartInnerWidth / csvData.length) + leftPadding + ((chartInnerWidth / csvData.length) / 2);
                return (xPosition)
            })
            .attr("cy", function(d){
                return yScale(parseFloat(d[expressed])) + topBottomPadding;
            })
            .attr("r", "4")
            .style("fill", function(d){
                return colorScale(d[expressed])
            })
            .attr("stroke", "#636363")
            .on("mouseover", function(event, d){
                highlight(d);
            });
    
        //create a text element for the chart title
        var chartTitle = chart.append("text")
            .attr("x", 40)
            .attr("y", 30)
            .attr("class", "chartTitle")
            .text(arrayDict[expressed]);
    
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
        updateChart(lines, circles, csvData.length, colorScale);
    };
    
    //dropdown change event handler
    function changeAttribute(attribute, csvData) {
    
        // change the expressed attribute
        expressed = attribute;
    
        // recreate color scale
        var colorScale = makeColorScale(csvData);
    
        // recolor counties
        var regions = d3.selectAll(".counties")
            .transition()
            .duration(1000)
            .style("fill", function (d) {
                var value = d.properties[expressed];
                if (value) {
                    return colorScale(d.properties[expressed]);
                } else {
                    return "#ccc";
                }
            });
    
        // set lines for each county
        var lines = d3.selectAll(".line")
    
        // circles
        var circles = d3.selectAll("circle")
    
        var domainArray = [];
        for (var i=0; i<csvData.length; i++){
            var val = parseFloat(csvData[i][expressed]);
            domainArray.push(val);
        };
        var max = d3.max(domainArray);
    
        yScale = d3.scaleLinear()
            .range([463, 0])
            .domain([0, max+(0.1*max)]);
    
        var yAxis = d3.axisLeft()
            .scale(yScale);
    
        d3.select(".axis").call(yAxis)
    
        // set line & circle positions, heights, and colors
        updateChart(lines, circles, csvData.length, colorScale);
    };
    
    //function to position, size, and color lines in chart
    function updateChart(lines, circles, n, colorScale){
        
        //position lines
        lines.attr("x", function(d, i){
                return i * (chartInnerWidth / n) + (leftPadding + 2.75)
            })
            // resize lines
            .attr("height", function(d, i){
                return 463 - yScale(parseFloat(d[expressed]));
            })
            .attr("y", function(d, i){
                return yScale(parseFloat(d[expressed])) + topBottomPadding;
            })
    
        // position circles
        circles.attr("cx", function(d, i) {
                return i * (chartInnerWidth / n) + leftPadding + ((chartInnerWidth / n) / 2);
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
    
        var chartTitle = d3.select(".chartTitle")
            .text(arrayDict[expressed] + " in each county");
    };
    
    //function to highlight enumeration units and bars
    function highlight(props){
        //change stroke
        var selected = d3.selectAll("." + props.STATEFP)
            .style("stroke", "blue")
            .style("stroke-width", "2");
    };
      
    })();