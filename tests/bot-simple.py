import requests

api_key = "vcx7p763rl8W09wCoElLAxrbk3HLYmkAoxRvPwlP"

url = "http://127.0.0.1:3000/bot"

# message to send the message to the server
def sendMessage(msg):
    payload = {}
    payload['key'] = api_key
    payload['message'] = msg
    r = requests.post(url, data = payload)

# Request the message
message = input("Write a message to send to your building: ")

# sends the message to the server
sendMessage(message)
