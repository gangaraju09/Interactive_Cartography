/*function myFunc(){
    var mydiv = document.getElementById("mydiv");
    mydiv.innerHTML = "Hey folks, I'm Ramakrishna your new mentor.";
};

window.onload = myFunc();*/

/*function initialize(){
  cities()
};
// define two arrays with cities and population
function cities(){

var cities =[
  'Madison',
  'Milwaukee',
  'Green Bay',
  'Superior'
];
var population = [
   233209,
   594833,
   104057,
   27244
];
// create a table element
var table = document.createElement('table');

//create a header row
var headerRow = document.createElement('tr');

//create a city column
var cityHeader = document.createElement('th');
cityHeader.innerHTML = 'city'
headerRow.appendChild(cityHeader)
//create a population column
var popHeader = document.createElement('th');
popHeader.innerHTML = 'population'
headerRow.appendChild(popHeader)
//add row to table
table.appendChild(headerRow)

// loop statement to get each city & population values in each row

for(i=0; i<cities.length; i++){
  var tr = document.createElement('tr')

  var city =document.createElement('td')
  city.innerHTML = cities[i]
  tr.append(city)
  
  var pop = document.createElement('td')
  pop.innerHTML = population[i]
  tr.appendChild(pop)

  table.append(tr)
}



 //add the table to the div in index.html
    var mydiv = document.getElementById("mydiv");
    mydiv.appendChild(table);
}
//call the initialize function when the window has loaded
window.onload = initialize(); */

//define an array of objects for cities and population

function cities (){   // defining function 


    var citypop = [       // creating required elements in the table
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
     //create the table skeleton
        var table = document.createElement("table");
          //create a table header row
        var headerRow = document.createElement("tr");

        //add the cities column        
         var cityHeader = document.createElement("th"); 
        cityHeader.innerHTML = "City";
        headerRow.appendChild(cityHeader);
    
        //add the "Population" column
        var popHeader = document.createElement("th");
        popHeader.innerHTML = "Population";
        headerRow.appendChild(popHeader);

         //add the "city size" column
         var sizeHeader = document.createElement("th");
         sizeHeader.innerHTML = "City Size";
         headerRow.appendChild(sizeHeader);
        
        //add row to table
        table.appendChild(headerRow)

        //how to push an element into the table
    var kennosha = {};
        //add each property to the object
        kennosha.city = 'kennosha';
        kennosha.population = 99606;
    
        //push the city object into the array
        citypop.push(kennosha);
    
    //create a loop to itirate each row in city pop to new table
    for(i=0;i<citypop.length;i++){
      var tr = document.createElement('tr')  // table for each row iteration
      table.appendChild(tr)
    
    //add city values in city column
    var city = document.createElement('td')
    city.innerHTML = citypop[i].city
    tr.appendChild(city)
    
    //add population values in population column
    var pop = document.createElement('td')
    pop.innerHTML = citypop[i].population
    tr.appendChild(pop)
    
    // create condition statement for city size
    var citySize = document.createElement('td')
    if(citypop[i].population<=100000){
      citySize.innerHTML = 'Small'
      tr.appendChild(citySize)
    }else if(citypop[i].population<=500000){
      citySize.innerHTML = 'Medium'
      tr.appendChild(citySize)
    }else if(citypop[i].population>500000){
      citySize.innerHTML = 'Large'
      tr.appendChild(citySize)
    }
    
    
    }
    //add the table to the div in index.html
        var mydiv = document.getElementById("mydiv");
        mydiv.appendChild(table);
    }
    
    
    //call the initialize function when the window has loaded
    window.onload = cities();