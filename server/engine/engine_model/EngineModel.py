
# coding: utf-8

# In[9]:


import pandas as pd
import numpy as np

from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import time


# In[3]:


# Prepare data set
dummy = pd.read_csv('../../data/menu.csv')
df = dummy.copy()
df.drop(columns=['Item', 'Serving Size'], inplace=True)


# In[4]:


# Process target labels into numeric
df2 = df.copy()
from sklearn.preprocessing import LabelEncoder
class_le = LabelEncoder()
y = class_le.fit_transform(df['Category'].values)
df2['y'] = y


# In[134]:


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

    Returns
    -------
    list
        Text and graph output

    """

    X = df.drop('Category', axis=1)
    y = df['Category']
    #itera = convert_num(itera)
    #size = convert_num(size)

    #C = [1e-8, 1e-4, 1e-3, 1e-2, 0.1, 0.2, 0.4, 0.75,
    #     1, 1.5, 3, 5, 10, 15,  20, 100, 300, 1000, 5000]
    
    C = np.logspace(-1, param_c, 15)

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
            'C: {0:.2}'.format(C[np.argmax(score)]),
            'Top predictor:{0}'.format(top_predictor),
            'Training time: {0:.4f} sec'.format(np.amax(timet)),
            'Testing time: {0:.4f} sec'.format(np.amax(timep))],
        "scoret_x": [i for i in range(len(scoret))],
        "scoret_y": scoret,
        "score_x": [i for i in range(len(scoret))],
        "score_y": score,
        "coefs_x": X.columns[np.argsort(abs_mean_coefs)],
        "coefs_y": sorted(abs_mean_coefs),
    }


# In[135]:


#build_model(itera=1, size=0.25, norm="l2", random="Yes", param_c=5)

