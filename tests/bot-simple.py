import requests

# bot Torre Norte
api_key = "pNsKnnllXxnNveyqrRUeDyxIhyYDqsxLGKOlJtSF"

# bot Civil
#api_key = "A4KrDgJjBXeaT0zREMkrwaZyB1oR9KZ14QpQbB6j"
    
url = "https://asint-chat.appspot.com/bot"
# url = "http://127.0.0.1:3000/bot"

# message to send the message to the server
def sendMessage(msg):
    payload = {}
    payload['key'] = api_key
    payload['message'] = msg
    r = requests.post(url, data = payload)
    print(r.status_code)

# Request the message
message = input("Write a message to send to your building: ")

# sends the message to the server
sendMessage(message)
