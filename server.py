from flask import Flask
import pandas as pd
import numpy as np 

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return 'Hello world'

