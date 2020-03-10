from flask import Flask, request
import pandas as pd
import numpy as np
import json
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

def perform_linear_regression():
    df = pd.read_csv('resources/USA_Housing.csv') #Read in the USA_Housing.csv file, located within the `/resources` folder
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

    #Storing the colum for the target variable (what we're trying to predict -- i.e., the `Price`)
    y = df[['Price']]

    '''
    Now, splitting the data into a Train/Test model
    '''
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4, random_state=101)

    #instantiating a LinearRegression object
    lm = LinearRegression()

    #fitting the model using the attributes and the target values
    lm.fit(X_train, y_train)

    #making an actual prediction using the trained model
    predictions = lm.predict(X_test)

    #graphing the predictions vs. actual:
    #plt.scatter(y_test, predictions)

    #predicting on a hard-coded entry:
    #print('X_test is: \n')
    #print(X_test.head())



@app.route('/', methods=['GET'])
def index():
    perform_linear_regression()
    return 'Hello world'


@app.route('/post', methods=['POST'])
def consumeUserInput():
    receivedDataAsJSON = request.get_json()
    print('received data is: {}'.format(receivedDataAsJSON))
    return 'SUCCESS!'
