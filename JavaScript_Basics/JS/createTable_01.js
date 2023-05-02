/*function myFunc(){
    var mydiv = document.getElementById("mydiv");
    mydiv.innerHTML = "Hey folks, I'm Ramakrishna your new mentor.";
};

window.onload = myFunc();*/

function initialize(){
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
  window.onload = initialize();
  