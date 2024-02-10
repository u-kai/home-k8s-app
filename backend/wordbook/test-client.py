import requests


def words():
    url = "http://192.168.3.68/words"

    try:
        response = requests.post(url, json={"userId": "test"})
        print(response.json())
    except Exception as e:
        print(e)


def registerWord():
    url = "http://192.168.3.68/registerWord"

    response = requests.post(url, json={"userId": "test", "word": "test"})

    print(response.json())


def deleteWord():
    url = "http://192.168.3.68/deleteWord"

    response = requests.post(url, json={"userId": "test", "wordId": "test"})

    print(response.json())


def updateWord():
    url = "http://192.168.3.68/updateWord"

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
