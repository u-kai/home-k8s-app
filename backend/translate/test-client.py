import requests
import sys

if len(sys.argv) != 2:
    PORT = 8080
else:
    PORT = sys.argv[1]

url = "http://localhost:" + str(PORT) + "/"

data = {"target": "test"}


response = requests.post(url, json=data)
print(response.text)
