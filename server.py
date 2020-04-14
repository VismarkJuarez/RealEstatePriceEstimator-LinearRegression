from flask import Flask, request
import pandas as pd
import numpy as np
import json
from Property import Property
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

cors = CORS(app, resources={
    r"/*": {
        "origins": "*"
    }
})

#instantiating a LinearRegression object
linearRegressionModel = LinearRegression()
df = pd.read_csv('resources/USA_Housing.csv') #Read in the USA_Housing.csv file, located within the `/resources` folder

def perform_linear_regression():
    #df = pd.read_csv('resources/USA_Housing.csv') #Read in the USA_Housing.csv file, located within the `/resources` folder
    print(df.info()) #printing info to the console.

    print(df.columns) #printing all of the column labels (attribute names).

    '''
    Storing all of the `features` in the dataset -- these are the attributes in the dataset
    that are NOT the target attribute (Price).  Note,`X` will NOT contain the `address` attribute
    because this is of type String.  The linear regression model cannot handle a string.  We might
    come back to this, find a way to normalize it to a number and use it for prediction.
    Joe brought up the idea of parsing the string and using the zip code.  This is a really good idea.
    TODO: Figure out how to use the zip code embedded in the address
    '''
    X = df[['Avg. Area Income', 'Avg. Area House Age', 'Avg. Area Number of Rooms',
       'Avg. Area Number of Bedrooms', 'Area Population']]

    #Storing the column for the target variable (what we're trying to predict -- i.e., the `Price`)
    y = df[['Price']]

    '''
    Now, splitting the data into a Train/Test model
    '''
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4, random_state=101)

    #fitting the model using the attributes and the target values
    linearRegressionModel.fit(X_train, y_train)

    #making an actual prediction using the trained model
    predictions = linearRegressionModel.predict(X_test)

    #graphing the predictions vs. actual:
    #plt.scatter(y_test, predictions)

    #predicting on a hard-coded entry:
    print('X_test is: \n')
    print(X_test.head())
    test_size = len(X_test)
    print('size of X_test is: {}'.format(test_size))

    print('X_test prediction results: \n')
    print(predictions)
    predictions_size = len(predictions)
    print('size of predictions is: {}'.format(predictions_size))


#Runs the linear regression model function at start up
perform_linear_regression()

'''
      Avg. Area Income  Avg. Area House Age  Avg. Area Number of Rooms  Avg. Area Number of Bedrooms  Area Population
1718       66774.99582             5.717143                   7.795215                          4.32      36788.98033
2511       62184.53937             4.925758                   7.427689                          6.22      26008.30912
345        73643.05730             6.766853                   8.337085                          3.34      43152.13958
2521       61909.04144             6.228343                   6.593138                          4.29      28953.92538
54         72942.70506             4.786222                   7.319886                          6.41      24377.90905
'''
def predictPriceEstimate(property:Property) -> []:
    #Creating a 2D array with the property data.  The array needs to be a 2D array since this is the format the predictor expects the data in
    propertyData = [[property.averageAreaIncome, property.averageAreaHouseAge, property.averageAreaNumberOfRooms, property.averageAreaNumberOfBedrooms, property.areaPopulation]]

    #Feeding the propertyData 2D array into the classifier.  This will yield a price estimate (prediction)
    priceEstimate2DArray = linearRegressionModel.predict(propertyData)

    #Only one prediction will be made, meaning there will only exist one item in the 2D array -- the first elemet of the first array in the 2D array.
    priceEstimate = priceEstimate2DArray[0][0]

    #return the estimated price
    return priceEstimate


@app.route('/', methods=['GET'])
def index():
    perform_linear_regression()
    return 'Hello world'


'''
Expecting a `dict` holding the consumed propertyData.  This will be parsed into
a Property object and returned.
'''
def deserializePropertyData(propertyDataJson: dict) -> Property:
    averageAreaIncome = propertyDataJson["averageAreaIncome"]
    averageAreaNumberOfRooms = propertyDataJson["averageAreaNumberOfRooms"]
    averageAreaHouseAge = propertyDataJson["averageAreaHouseAge"]
    averageAreaNumberOfBedrooms = propertyDataJson["averageAreaNumberOfBedrooms"]
    areaPopulation = propertyDataJson["areaPopulation"]

    property = Property(averageAreaIncome, averageAreaNumberOfRooms, averageAreaHouseAge, averageAreaNumberOfBedrooms, areaPopulation)
    return property

'''
Will receive data in the following JSON format:

{
  "averageAreaIncome": 200000,
  "averageAreaNumberOfRooms": 6,
  "averageAreaHouseAge": 120,
  "averageAreaNumberOfBedrooms": 3,
  "areaPopulation": 234000
}

'''
@app.route('/predictPrice', methods=['POST'])
def consumeUserInput():
    receivedDataAsJSON = request.get_json()
    print('received data is: {}'.format(receivedDataAsJSON))
    property = deserializePropertyData(receivedDataAsJSON)
    estimate = predictPriceEstimate(property)
    print('returning: {}'.format(estimate))

    #TODO The following line is added purely for experimental purposes:
    retrieveSimilarEstimates(estimate)

    #Return the estimated price, as a JSON formatted string
    return "{ " + "estimate: {}".format(estimate) + " }"


'''
Returns data in the following format: 
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

'''
@app.route('/similarlyPricedRecords/<float:price>', methods=['GET'])
def retrieveSimilarEstimates(price):
    #Determines how much of a price deviation constitutes as "similarly priced"
    DEVIATION_FROM_PRICE = 50000
    recordsWithSimilarPrice = df.loc[(df['Price'] >= (price - DEVIATION_FROM_PRICE)) & (df['Price'] <= (price) + DEVIATION_FROM_PRICE)]
    print(recordsWithSimilarPrice)
    return  "{ rows: " + recordsWithSimilarPrice.to_json(orient='records') + " }"