import time
import pandas as pd


data = {
    'Nsous' : [1],
    'Nsens' : [1],
    'ylim' : [1],
    'size' : [1],
    'time' : [1]
}

#df = pd.DataFrame(data, columns = ['Nsous', 'Nsens', 'ylim', 'size', 'time'])
data_time = pd.read_csv(r'example.csv')
data_time = data_time.append(data, ignore_index=True)
data_time.to_csv('example.csv')