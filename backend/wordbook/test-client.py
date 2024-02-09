import requests


def words():
    url = "http://localhost:8080/words"

    response = requests.post(url, json={"userId": "test"})

    print(response.json())


def registerWord():
    url = "http://localhost:8080/registerWord"

    response = requests.post(url, json={"userId": "test", "word": "test"})

    print(response.json())


def deleteWord():
    url = "http://localhost:8080/deleteWord"

    response = requests.post(url, json={"userId": "test", "wordId": "test"})

    print(response.json())


def updateWord():
    url = "http://localhost:8080/updateWord"

    response = requests.post(
        url, json={"userId": "test", "wordId": "test", "word": "test"}
    )

    print(response.json())


def main():
    words()
    registerWord()
    deleteWord()
    updateWord()


main()
