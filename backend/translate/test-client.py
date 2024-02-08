import requests
import sys

if len(sys.argv) != 2:
    PORT = 8080
else:
    PORT = sys.argv[1]

url = "https://api.kaiandkai.com/translate"  # + str(PORT) + "/"

data = {"target": "test"}


response = requests.post(url, json=data)
print(response.text)
