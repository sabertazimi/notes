---
sidebar_position: 12
tags: [AI, Language, Python, I/O, File]
---

# I/O

## Text

Standard library:

```python
from pathlib import Path

path = Path('alice.txt')

try:
  contents = path.read_text(encoding='utf-8').rstrip()
except FileNotFoundError:
  print(f"Sorry, the file {path} does not exist.")
else:
  words = contents.split()
  num_words = len(words)
  print(f"The file {path} has about {num_words} words.")

  lines = contents.splitlines()
  path.write_text(lines)
```

Numpy:

```python
import numpy as np
x, y = np.loadtxt('input.dat', delimiter=',', unpack=True)
```

## JSON

```python
from pathlib import Path
import json
import pandas as pd

path = Path('data.json')
contents = path.read_text()
data_listOfDict = json.loads(contents)

# We can do the same thing with pandas
data_df = pd.read_json('data.json', orient='records')

# We can write a dictionary to JSON like so
# Use 'indent' and 'sort_keys' to make the JSON
# file look nice
path = Path('new_data.json')
contents = json.dump(data_listOfDict, indent=4, sort_keys=True)
path.write_text(contents)

# And again the same thing with pandas
export = data_df.to_json('new_data.json', orient='records')
```

## CSV

```python
from pathlib import Path
import csv

path = Path('weather_data/sitka_weather_07-2021_simple.csv')
lines = path.read_text().splitlines()
reader = csv.reader(lines)
header_row = next(reader)

for index, column_header in enumerate(header_row):
  print(index, column_header)

highs = []
for row in reader:
  high = int(row[4])
  highs.append(high)
```

```python
import csv

# Field names
fields = ['Name', 'Goals', 'Assists', 'Shots']

# Rows of data in the csv file
rows = [ ['Emily', '12', '18', '112'],
         ['Katie', '8', '24', '96'],
         ['John', '16', '9', '101'],
         ['Mike', '3', '14', '82']]

filename = "soccer.csv"

# Writing to csv file
with open(filename, 'w+') as csvFile:
    # Creating a csv writer object
    csvWriter = csv.writer(csvFile)

    # Writing the fields
    csvWriter.writerow(fields)

    # Writing the data rows
    csvWriter.writerows(rows)
```

```python
import pandas as pd

filename = "my_data.csv"

# Read in the data
data = pd.read_csv(filename)

# Print the first 5 rows
print(data.head(5))

# Write the data to file
data.to_csv("new_data.csv", sep=",", index=False)
```

## XML

```python
import xml.etree.ElementTree as ET
import xmltodict
import json

tree = ET.parse('output.xml')
xml_data = tree.getroot()

xmlStr = ET.tostring(xml_data, encoding='utf8', method='xml')

data_dict = dict(xmltodict.parse(xmlStr))

print(data_dict)

with open('new_data_2.json', 'w+') as json_file:
    json.dump(data_dict, json_file, indent=4, sort_keys=True)
```

## Converter

```python
import pandas as pd
from dicttoxml import dicttoxml
import json

# Building our dataframe
data = {'Name': ['Emily', 'Katie', 'John', 'Mike'],
        'Goals': [12, 8, 16, 3],
        'Assists': [18, 24, 9, 14],
        'Shots': [112, 96, 101, 82]
        }

df = pd.DataFrame(data, columns=data.keys())

# Converting the dataframe to a dictionary
# Then save it to file
data_dict = df.to_dict(orient="records")
with open('output.json', "w+") as f:
    json.dump(data_dict, f, indent=4)

# Converting the dataframe to XML
# Then save it to file
xml_data = dicttoxml(data_dict).decode()
with open("output.xml", "w+") as f:
    f.write(xml_data)
```

```python
import json
import pandas as pd
import csv

# Read the data from file
# We now have a Python dictionary
with open('data.json') as f:
    data_listOfDict = json.load(f)

# Writing a list of dicts to CSV
keys = data_listOfDict[0].keys()
with open('saved_data.csv', 'wb') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(data_listOfDict)
```
