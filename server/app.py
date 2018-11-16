from flask import Flask
from flask import send_from_directory
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import time
import json
#from engine.engine_model import EngineModel

# instantiate Flask thing into app
app = Flask(__name__)

# route the index html into home 127.0.0.1
@app.route('/')
def index():
    return send_from_directory("../web", "index.html")

# route CSS_JS
@app.route("/web/<path:path>")
def serve_css_js(path): 
    return send_from_directory("../web", path)

# read the data
# columns: province, city_muni, year, ira
#ira_df = pd.read_csv("data/ira.csv")
ira_df = pd.read_csv("data/ira_pivot.csv")

# Read CSV
dummy = pd.read_csv("data/menu.csv")
df = dummy.copy()
df.drop(columns=["Item", "Serving Size"], inplace=True)

# Recode label
df2 = df.copy()
from sklearn.preprocessing import LabelEncoder
class_le = LabelEncoder()
y = class_le.fit_transform(df["Category"].values)
df2['y'] = y

# Convert numerical data to numbers
#ira_df.year = ira.year.astype(str)
#ira_df.ira = ira.ira.astype(float)

#print(ira_df.head())
print(df2.head())

@app.route('/provinces')
def get_provinces():
    return json.dumps(list(ira_df["province"].unique()))

@app.route('/years')
def get_years():
    return json.dumps(ira_df.columns[2:].tolist())

@app.route('/ira/<province>/<year>')
def get_ira_province_year(province, year):
    filtered_df = ira_df[ira_df['province'] == province]
    return json.dumps(filtered_df[['city_muni',year]].to_dict())

@app.route('/ira/<muni>')
def get_ira_muni(muni):
    filtered_df = ira_df[ira_df['city_muni'] == muni]
    res = {
        'year': list(filtered_df.columns)[2:],
        'value': list(filtered_df.values[0][2:])
    }
    return json.dumps(res)


# Route target
@app.route("/target")
def get_target():
    return json.dumps(df["Category"].tolist())


# Route target
@app.route("/target/pcc")
def get_target_pcc():
    result = {
        "value1": list(df.groupby(['Category'])['Calories'].count().index),
        "value2": df.groupby(['Category'])['Calories'].count().values.tolist()
    }
    return json.dumps(result)


# Route features
@app.route("/features")
def get_features():
    return json.dumps(df.drop(["Category"], axis=1).to_dict())


# Route feature names
@app.route("/featurenames")
def get_featurenames():
    return json.dumps(df.drop(["Category"], axis=1).columns.tolist())


# Route one feature
@app.route("/features/<colname>")
def get_features_one(colname):

    if not colname:
        colname = "Calories"

    return json.dumps(list(df[colname]))


# Route two features
@app.route("/features/<colname1>/<colname2>")
def get_features_two(colname1, colname2):

    if not colname1:
        colname1 = "Calories"

    if not colname2:
        colname2 = "Sodium"

    result = {
        "value1": list(df[colname1]),
        "value2": list(df[colname2])
    }
    return json.dumps(result)


# Route EngineModel predefined results
@app.route("/engine")
def get_engine(itera=1, size=0.25, norm="l2", random="Yes", param_c=5):

    result = build_model(itera, size, norm, random, param_c)
    
    return json.dumps(result)


# Route EngineModel results
@app.route("/enginemodel/<itera>/<size>/<norm>/<random>/<param_c>")
def get_enginemodel(itera, size, norm, random, param_c):

    itera = int(itera)
    size = float(size)
    param_c = float(param_c)

    result = build_model(itera, size, norm, random, param_c)
    
    return json.dumps(result)



# Build model
def build_model(itera, size, norm, random, param_c):
    """
    Build model of prediction.

    Parameters
    ----------
    submit: str
        Click to run model
    itera: int
        Number of iteration
    size : int
        Size of test set
    norm : int
        Regularization
    random : int
        Condition for random_state
    param_c : int

    Returns
    -------
    dict
        results

    """

    X = df.drop('Category', axis=1)
    y = df['Category']
    
    listC = [1e-8, 1e-4, 1e-3, 1e-2, 0.1, 0.2, 0.4, 0.75, 1, 1.5, 3, 5, 10, 15,  20, 100, 300, 1000, 5000]

    C = []
    for i in listC:
        C.append(i)
        if i == param_c:
            break
    

    score_train = []
    score_test = []
    weighted_coefs = []
    time_train = []
    time_predict = []

    for seed in range(itera):
        if random == 'Yes':
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=size, random_state=seed)
        else:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=size, random_state=1)

        acc_train = []
        acc_test = []
        tm_train = []
        tm_predict = []

        for alpha_run in C:
            lr = LogisticRegression(C=alpha_run, penalty=norm)

            time_train_start = time.time()
            lr.fit(X_train, y_train)
            time_train_end = time.time()

            if alpha_run == 0.1:
                coefs = lr.coef_
                weighted_coefs.append(coefs)

            time_predict_start = time.time()
            lr.predict(X_test)
            time_predict_end = time.time()

            acc_train.append(lr.score(X_train, y_train))
            acc_test.append(lr.score(X_test, y_test))
            tm_train.append(time_train_end - time_train_start)
            tm_predict.append(time_predict_end - time_predict_start)

        score_train.append(acc_train)
        score_test.append(acc_test)
        time_train.append(tm_train)
        time_predict.append(tm_predict)

    mean_coefs = np.mean(weighted_coefs, axis=0)
    scoret = np.mean(score_train, axis=0)
    score = np.mean(score_test, axis=0)
    timet = np.mean(time_train, axis=0)
    timep = np.mean(time_predict, axis=0)

    top_predictor = X.columns[np.argmax(np.abs(mean_coefs))]
    abs_mean_coefs = np.abs(mean_coefs[0, :])
    coefs_count = len(abs_mean_coefs)

    return {
        "description":[
            'Logistic({0})'.format(norm),
            'Accuracy: {0:.2%}'.format(np.amax(score)),
            'C: {0}'.format(C[np.argmax(score)]),
            'Top predictor:{0}'.format(top_predictor),
            'Training time: {0:.4f} sec'.format(np.amax(timet)),
            'Testing time: {0:.4f} sec'.format(np.amax(timep))],
        "scoret_x": [i for i in range(len(scoret))],
        "scoret_y": list(scoret),
        "score_x": [i for i in range(len(scoret))],
        "score_y": list(score),
        "coefs_x": list(X.columns[np.argsort(abs_mean_coefs)]),
        "coefs_y": sorted(abs_mean_coefs),
    }

# Run app
if __name__ == "__main__":
    app.run(port=8090)
