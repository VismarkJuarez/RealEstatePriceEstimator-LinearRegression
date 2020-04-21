var myButton = document.getElementById("myButton");

//Initiating objects to hold charts data (these will be initialized later)
var linearRegressionChart = null;

var similarPricesList = [];
var similarPricesAddressList = [];

var averageAreaIncomeInput = document.getElementById('income');
var averageAreaNumberOfRoomsInput = document.getElementById('num_of_rooms');
var averageAreaHouseAgeInput = document.getElementById('age');
var averageAreaNumberOfBedroomsInput = document.getElementById('bedrooms');
var areaPopulationInput = document.getElementById('population');

var similarRecordsTable = document.getElementById('similarRecordsTable');
var similarRecordsSection = document.querySelector(".tableSection");
var chartCanvasSection = document.querySelector(".chartCanvasDiv");

var priceEstimateParagraph = document.getElementById('priceEstimate');

myButton.addEventListener("click", makeRequest);

function makeRequest() {
  var averageAreaIncome = parseInt(averageAreaIncomeInput.value, 10);
  var averageAreaNumberOfRooms = parseInt(averageAreaNumberOfRoomsInput.value, 10);
  var averageAreaHouseAge = parseInt(averageAreaHouseAgeInput.value, 10);
  var averageAreaNumberOfBedrooms = parseInt(averageAreaNumberOfBedroomsInput.value, 10);
  var areaPopulation = parseInt(areaPopulationInput.value, 10);

  console.log(averageAreaIncome);
  console.log(averageAreaNumberOfRooms);
  console.log(averageAreaHouseAge);
  console.log(averageAreaNumberOfBedrooms);
  console.log(areaPopulation);

  //TODO refactor to extract the similarPricedhome GET req out of the downward
  //processing scheme.
  postUserInputToApi(averageAreaIncome, averageAreaNumberOfRooms,
    averageAreaHouseAge, averageAreaNumberOfBedrooms,
    areaPopulation);

  //should be moved elsewhere
  generateGraph();
}

//TODO: clean up the table's numeric values
//TODO: Refactor the logic to something more maintainable
//TODO: Clear table when a new query is made (except for table header)
//TODO: don't show table at all if no results are found
//TODO: add table description
function fetchSimilarPricedHomes(price) {
  //http://localhost:5000/predictPrice
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", "http://localhost:5000/similarlyPricedRecords/"
    + price, false ); // false for synchronous request

  xmlHttp.send( null );
  var responseText = xmlHttp.responseText
  console.log(responseText)

  var rowsList = extractRowsListFromRowsJson(responseText);
  var firstItem = rowsList[0];

  //console.log("firstItem income: " + firstItem["Avg. Area Income"]);
  populateSimilarRecordsTable(rowsList);

  return responseText;
}


function populateSimilarRecordsTable(rowsList) {

  if(rowsList.length > 0) {
    showSimilarRecordsTableSection();
    showChartCanvasSection();
  } else {
    hideSimilarRecordsTableSection();
    hideChartCanvasSection();
  }

  //iterate through each element. Each entry is a new row in the chart.
  for(let i = 0; i < rowsList.length; i++) {
    var rowObject = deserializeRowObject(rowsList[i]);
    console.log(rowObject);

    //Add a new row as the last row in the table
    var row = similarRecordsTable.insertRow(-1);

    //add each cell to the row.
    var avgAreaIncomeCell = row.insertCell(-1);
    var avgAreaHouseAgeCell = row.insertCell(-1);
    var avgNumOfRoomsCell = row.insertCell(-1);
    var avgAreaNumberOfBedroomsCell = row.insertCell(-1);
    var areaPopulationCell = row.insertCell(-1);
    var priceCell = row.insertCell(-1);
    var addressCell = row.insertCell(-1);

    //Setting the contents of the cells
    avgAreaIncomeCell.innerHTML = rowObject.avgAreaIncome;
    avgAreaHouseAgeCell.innerHTML = rowObject.avgAreaHouseAge;
    avgNumOfRoomsCell.innerHTML = rowObject.avgAreaNumberOfRooms;
    avgAreaNumberOfBedroomsCell.innerHTML = rowObject.avgAreaNumberOfBedrooms;
    areaPopulationCell.innerHTML = rowObject.areaPopulation;
    priceCell.innerHTML = rowObject.price;
    addressCell.innerHTML = rowObject.address;

    //TODO: Move elsewhere
    //lastly, store the addresses and prices for charting with charts.js
    similarPricesAddressList.push(rowObject.address);
    similarPricesList.push(rowObject.price);
  }

  //TODO Move elsewhere.
}

function showSimilarRecordsTableSection() {
  similarRecordsSection.style.display = "block";
}

function showChartCanvasSection() {
  chartCanvasSection.style.display="block";
}

function hideChartCanvasSection() {
  chartCanvasSection.style.display="none";
}

function hideSimilarRecordsTableSection() {
  similarRecordsSection.style.display = "none";
}

/*
Receives a JSON-string formatted representation of a row, which looks
as follows:

{
  "Avg. Area Income": 37971.20757,
  "Avg. Area House Age": 4.291223903,
  "Avg. Area Number of Rooms": 5.807509527,
  "Avg. Area Number of Bedrooms": 3.24,
  "Area Population": 33267.76773,
  "Price": 31140.51762,
  "Address": "98398 Terrance Pines\nSouth Joshua, MT 00544-8919"
}

The same data is returned, as a JSON object.

*/
function deserializeRowObject(rowAsJsonString) {

  var rowObject = {
    avgAreaIncome: rowAsJsonString["Avg. Area Income"],
    avgAreaHouseAge: rowAsJsonString["Avg. Area House Age"],
    avgAreaNumberOfRooms: rowAsJsonString["Avg. Area Number of Rooms"],
    avgAreaNumberOfBedrooms: rowAsJsonString["Avg. Area Number of Bedrooms"],
    areaPopulation: rowAsJsonString["Area Population"],
    price: rowAsJsonString["Price"],
    address: rowAsJsonString["Address"]
  };

  return rowObject;
}


/*
jsonToParse example:

{
    "rows": [
        {
            "Avg. Area Income": 37971.20757,
            "Avg. Area House Age": 4.291223903,
            "Avg. Area Number of Rooms": 5.807509527,
            "Avg. Area Number of Bedrooms": 3.24,
            "Area Population": 33267.76773,
            "Price": 31140.51762,
            "Address": "98398 Terrance Pines\nSouth Joshua, MT 00544-8919"
        },
        {
            "Avg. Area Income": 47320.65721,
            "Avg. Area House Age": 3.55805376,
            "Avg. Area Number of Rooms": 7.006987009,
            "Avg. Area Number of Bedrooms": 3.16,
            "Area Population": 15776.6186,
            "Price": 15938.65792,
            "Address": "91410 Megan Camp Suite 360\nLaurafort, OH 15735"
        }
    ]
}

This function returns the "rows" property in the above json.
*/
function extractRowsListFromRowsJson(jsonToParse) {
  return JSON.parse(jsonToParse)["rows"];
}


function postUserInputToApi(averageAreaIncome, averageAreaNumberOfRooms,
  averageAreaHouseAge, averageAreaNumberOfBedrooms, areaPopulation) {

  var userInputAsJSON = JSON.stringify({
    "averageAreaIncome": averageAreaIncome,
    "averageAreaNumberOfRooms": averageAreaNumberOfRooms,
    "averageAreaHouseAge": averageAreaHouseAge,
    "averageAreaNumberOfBedrooms": averageAreaNumberOfBedrooms,
    "areaPopulation": areaPopulation
  });

  console.log("sending the following payload to the API: " + userInputAsJSON);

  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance

  xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          //Extracting, formatting and outputting the resulting prediction.
          var usdFormattedPrediction = formatAsUSD(this.responseText);
          priceEstimateParagraph.innerHTML = usdFormattedPrediction;
        }
    };

  xmlhttp.open("POST", "http://localhost:5000/predictPrice");
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  var responseBody = xmlhttp.send(userInputAsJSON);

  console.log("response body: " + responseBody);
}

function extractListOfRows() {

}


/**
 * TODO: This logic is overly complicated --- needs to be simplified.
 * TODO: Add commas.
 *
 * [formatPredictionResponse description]
 * @param  {[type]} predictionJson [description]
 * @return {[type]}                [description]
 */
function formatAsUSD(predictionJson) {
  console.log(predictionJson);
  var predictionJsonWithoutMetadata = predictionJson.split(":");
  var predictionString = predictionJsonWithoutMetadata[1].split("}")[0];
  var splitPrediction = predictionString.split(".");
  var dollarValue = splitPrediction[0];
  var centValue = splitPrediction[1].substr(0,2); //up to two decimal places
  var dollarAndCentValue = dollarValue + "." + centValue;
  var predictionAsDollarAmount = "$" + dollarAndCentValue;

  var dollarAndCentAsFloat = parseFloat(dollarAndCentValue);

  //TODO: should be moved elsewhere
  fetchSimilarPricedHomes(dollarAndCentAsFloat);

  return predictionAsDollarAmount;
}


function generateGraph() {
  //If the chart already contains data on it, destroy it.
  if (linearRegressionChart != null) {
    linearRegressionChart.destroy();
  }

  //construct a new Chart object on the canvas.
  var ctx = document.getElementById('estimate-results-canvas').getContext('2d');
  linearRegressionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: similarPricesAddressList,
      datasets: [{
        label: "Price comparison",
        data: similarPricesList,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 0.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRation: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

}
