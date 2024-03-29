import requests
import random


def register_and_fetch_update():
    url = "http://dev.kaiandkai.com/wordbook/registerWord"

    randWord = str(random.randint(0, 1000000))
    userId = "test" + randWord
    response = requests.post(
        url,
        json={
            "userId": userId,
            "word": "test" + randWord,
            "meaning": "試験",
            "pronunciation": "てすと",
            "remarks": "テストって嫌だよね",
            "sentences": [{"value": "this is test", "meaning": "これはテスト"}],
        },
    )

    print("response", response.status_code)
    word_id = response.json()["wordId"]
    sentenceId = response.json()["sentences"][0]["sentenceId"]
    print("registerWord")
    print(response.json())

    url = "http://dev.kaiandkai.com/wordbook/words?userId=" + userId
    response = requests.get(
        url,
    )

    print("words")
    for j in response.json():
        print("*******************")
        print(j)

    url = "http://dev.kaiandkai.com/wordbook/updateWord"
    response = requests.post(
        url,
        json={
            "userId": userId,
            "wordId": word_id,
            "meaning": "これはテストでござる",
            "word": "test",
            "likeRates": "normal",
            "pronunciation": "これはテストでござる!!!!",
            "remarks": "忍者",
            "sentences": [
                {
                    "sentenceId": sentenceId,
                    "value": "this is test",
                    "meaning": "これはテストでごわす",
                },
                {"value": "this is test", "meaning": "これはテストでやんす"},
            ],
        },
    )
    print("updateWord")
    print(response.json())

    url = "http://dev.kaiandkai.com/wordbook/words?userId=" + userId
    response = requests.get(
        url,
    )

    print("words2")
    for j in response.json():
        print("-------------------")
        print(j)


def words():
    url = "http://localhost/words"

    try:
        response = requests.post(url, json={"userId": "test"})
        print(response.json())
    except Exception as e:
        print(e)


def registerWord():
    url = "http://localhost/registerWord"

    response = requests.post(url, json={"userId": "test", "word": "test"})

    print(response.json())


def deleteWord():
    url = "http://localhost/deleteWord"

    response = requests.post(url, json={"userId": "test", "wordId": "test"})

    print(response.json())


def updateWord():
    url = "http://localhost/updateWord"

    response = requests.post(
        url, json={"userId": "test", "wordId": "test", "word": "test"}
    )

    print(response.json())


def main():
    register_and_fetch_update()


main()
