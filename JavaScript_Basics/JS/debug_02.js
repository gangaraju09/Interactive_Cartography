//Function to initialize when script exceuted
function initialize(){
    cities()
}
// function to create table with cities, population and city size
function cities (){


    var cityPop = [
      { city: 'Madison',
                population: 233209
            },
            {
                city: 'Milwaukee',
                population: 594833
            },
            {
                city: 'Green Bay',
                population: 104057
            },
            {
                city: 'Superior',
                population: 27244
            },
    ]
     //create the table element
        var table = document.createElement("table");
        
        //how to push an element into the table
    var middleton = {};
        //add each property to the object
        middleton.city = 'Middleton';
        middleton.population = 233209;
    
        //push the city object into the array
        cityPop.push(middleton);

          //create a header row
  var headerRow = document.createElement('tr');
  
  //create a city column
  var cityHeader = document.createElement('th');
  cityHeader.innerHTML = 'City'
  headerRow.appendChild(cityHeader)
  //create a population column
  var popHeader = document.createElement('th');
  popHeader.innerHTML = 'Population'
  headerRow.appendChild(popHeader)

  //create a city size column
  var citySize = document.createElement('th');
  citySize.innerHTML = 'City Size'
  headerRow.appendChild(citySize)
  //add row to table
  table.appendChild(headerRow)
    
    //create a loop to itirate each row in city pop to new table
   
    for(i=0;i<cityPop.length;i++){
      var tr = document.createElement('tr')
      table.appendChild(tr)


    
    var city = document.createElement('td')
    city.innerHTML = cityPop[i].city
    tr.appendChild(city)
    
    var pop = document.createElement('td')
    pop.innerHTML = cityPop[i].population
    tr.appendChild(pop)

 // create condition statement for city size
    var citySize = document.createElement('td')
    if(cityPop[i].population<=100000){
      citySize.innerHTML = 'Small'
      tr.appendChild(citySize)
    }else if(cityPop[i].population<=500000){
      citySize.innerHTML = 'Medium'
      tr.appendChild(citySize)
    }else if(cityPop[i].population>500000){
      citySize.innerHTML = 'Large'
      tr.appendChild(citySize)
    }

      //append the table element to the div
	document.querySelector("#mydiv").appendChild(table);

    addColumns(cityPop);
    addEvents();
    }
    
}


function addColumns(cityPop){
    
    
};

function addEvents(){
	//add random color on mouseover

	//select the table element
	table = document.querySelector("table");

	//add mouseover event
	document.querySelector("table").addEventListener("mouseover", function(){
		var color = "rgb(";
		//generate random color
		for (var i=0; i<3; i++){

			var random = Math.round(Math.random() * 255);
			color += random;

			if (i<2){
				color += ",";
			} else {
				color += ")";
			};
		}
		//style table with the random style
		table.style.color = color;
	}); 

	//function that shows an alert on click
	function clickme(){
		alert('Hey, you clicked me!');
	};

	//event listener for the click
	table.addEventListener("click", clickme)
};

//call the initialize function when the document has loaded
document.addEventListener('DOMContentLoaded',initialize)