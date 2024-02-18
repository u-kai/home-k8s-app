import requests

url = "http://localhost:8080/translate/createSentence"

data = {
    "word": "hello",
}

response = requests.post(url, json=data)
print(response.json())
