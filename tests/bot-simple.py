import requests

# bot Torre Norte
api_key = "Vkj1ZsQDWmbFT8UKmzpWKr1BcFThfTgRTcd77dM0"

# bot Central
#api_key = "cYidKeTM3wFnLYhPX73ztkLRxdE4oXwQoMkIpKyR"

#url = "https://asint-chat.appspot.com/bot"
url = "http://127.0.0.1:3000/bot"

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
