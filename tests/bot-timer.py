import requests
import time

#api_key = "vcx7p763rl8W09wCoElLAxrbk3HLYmkAoxRvPwlP"

# bot Civil
api_key = "A4KrDgJjBXeaT0zREMkrwaZyB1oR9KZ14QpQbB6j"
    
url = "https://asint-chat.appspot.com/bot"

# message to send the message to the server
def sendMessage(msg):
    payload = {}
    payload['key'] = api_key
    payload['message'] = msg
    r = requests.post(url, data = payload)

# Request the message and the message period
message = input("Write a message to send to your building: ")
period = input("Write a waiting interval between messages: ")

# sends the message to the server every period seconds
while 1:
    sendMessage(message)
    time.sleep(float(period))