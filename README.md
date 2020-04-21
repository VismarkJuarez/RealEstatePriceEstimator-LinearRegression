# Running the app

### 1). use to `cd` command to navigate into the `RealEstatePriceEstimator-LinearRegression` directory

```bash
$ cd RealEstatePriceEstimator-LinearRegression
```

### 2). Run the following list of commands to initialize a virtual Python environment:

```bash
$ python3 -m venv venv
$ source venv/bin/activate
$ pip install --upgrade pip
```


### 3). Install all project dependencies by running the following command:

```bash
pip install -r requirements.txt
```

### 4). You may now run the application by running the following command:

```bash
 $ env FLASK_APP=server.py flask run
```

Your output will look as below:

```bash
(venv) [vismarkjuarez@Vismarks-MBP:~/Documents/Github/RealEstatePriceEstimator-LinearRegression (master)
 $ env FLASK_APP=server.py flask run
 * Serving Flask app "server.py"
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```
## Running the application in Windows...
```bash
python -m venv venv
```
```bash
venv\scripts\activate.bat
```
```bash
set FLASK_APP=server.py
```
```bash
flask run
```
