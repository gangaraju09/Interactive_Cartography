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

function cities (){


    var citypop = [
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
        citypop.push(middleton);
    
    //create a loop to itirate each row in city pop to new table
    for(i=0;i<citypop.length;i++){
      var tr = document.createElement('tr')
      table.appendChild(tr)
    
    var city = document.createElement('td')
    city.innerHTML = citypop[i].city
    tr.appendChild(city)
    
    var pop = document.createElement('td')
    pop.innerHTML = citypop[i].population
    tr.appendChild(pop)
    
    
    }
    //add the table to the div in index.html
        var mydiv = document.getElementById("mydiv");
        mydiv.appendChild(table);
    }
    
    
    //call the initialize function when the window has loaded
    window.onload = cities();