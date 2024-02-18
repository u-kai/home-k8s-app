import requests

url = "http://dev.kaiandkai.com/translate/createSentence"

data = {
    "word": "hello",
}
headers = {"Content-Type": "application/json", "Authorization": "Bearer 1234567890"}

response = requests.post(url, json=data, headers=headers)
print(response.status_code)
print(response.json())
