#!/usr/bin/python3
import requests
import json
import sys


def login():
	print (30 * "-" , "Login" , 30 * "-")
	
	#verificado pelo servidor
	user = input("Username: ")
	password = input("Password: ")
	
	payload = {'username':user, 'password':password}
	#url = "https://asint-chat.appspot.com/admin/login"
	url = "http://127.0.0.1:3000/admin/login"
	r = requests.post(url, data = payload) #post
	key = r.json() #convert response to dictionary
	
	return key["adminkey"] #retrieve key


def sendFile(secretKey):
	
	payload = {}
	params = {}
	headers = {'Content-type': 'application/json'}
	payload['adminkey'] = secretKey
	
	url = "https://asint-chat.appspot.com/admin/building"
	with open("../data/buildings-alameda.json") as data:
		payload['building'] = json.load(data)
	r = requests.post(url, headers = headers, data = json.dumps(payload))


#list all logged users
def listAll(secretKey):

	payload = {}
	params = {}
	headers = {'Content-type': 'application/json'}
	payload['adminkey'] = secretKey
	
	#url = "http://asint-chat.appspot.com/admin/list/users"
	url = "http://localhost:3000/admin/list/users"
	r = requests.get(url, data = payload)
	#print only name - id
	data = r.json()
	for i in data:
		print("\n" + i['ist_id'] + " - " + i['name'])


#list all move logs
def listAllMoves(secretKey):
	
	payload = {}
	params = {}
	headers = {'Content-type': 'application/json'}
	payload['adminkey'] = secretKey
	
	#url = "http://asint-chat.appspot.com/admin/list/users"
	url = "http://localhost:3000/admin/list/logs/movements"
	r = requests.get(url, data = payload)
	#print only name - id
	data = r.json()
	for i in data:
		print(i)
		print("\n")
		
def listAllMsgs(secretKey):
	
	payload = {}
	params = {}
	headers = {'Content-type': 'application/json'}
	payload['adminkey'] = secretKey
	
	#url = "http://asint-chat.appspot.com/admin/list/users"
	url = "http://localhost:3000/admin/list/logs/messages"
	r = requests.get(url, data = payload)
	#print only name - id
	data = r.json()
	for i in data:
		print(i)
		print("\n")
	
#list all users in a selected building
def listUsersByBuilding(secretKey):
	
	payload = {}
	params = {}
	payload['adminkey'] = secretKey
	headers = {'Content-type': 'application/json'}
	
	#url = "https://asint-chat.appspot.com/admin/list/users/building/"
	url = "http://localhost:3000/admin/list/users/building/"
	url = url + input("Insert building name: ") #update url with building selected
	
	r = requests.get(url, data = payload)
	data = r.json()
	for i in data:
		print("\n" + i['ist_id'])
	
def listAllLogs(secretKey):
	
	payload = {}
	params = {}
	payload['adminkey'] = secretKey
	headers = {'Content-type': 'application/json'}
	
	#url = "https://asint-chat.appspot.com/admin/list/users/building/"
	url = "http://localhost:3000/admin/list/logs"
	
	r = requests.get(url, data = payload)
	data = r.json()
	for i in data:
		print(i)
		print("\n")
	
def listLogsByUser(secretKey):
	
	payload = {}
	params = {}
	payload['adminkey'] = secretKey
	headers = {'Content-type': 'application/json'}
	
	#url = "https://asint-chat.appspot.com/admin/list/users/building/"
	
	kind = input("[1] - Messages\n[2] - Moves\nOption: ");
	if (kind == '1'): #list messages
		url = "http://localhost:3000/admin/list/logs/messages/user/"
	if (kind == '2'): #list moves
		url = "http://localhost:3000/admin/list/logs/movements/user/"
	
	url = url + input("Insert user id: ") #updated url with selected user
	
	r = requests.get(url, data = payload)
	data = r.json()
	for i in data:
		print(i)
		print("\n")
	
def listLogsByBuilding(secretKey):
	
	payload = {}
	params = {}
	payload['adminkey'] = secretKey
	headers = {'Content-type': 'application/json'}
	
	#url = "https://asint-chat.appspot.com/admin/list/users/building/"
	kind = input("[1] - Messages\n[2] - Moves\nOption: ");
	if (kind == '1'): #list messages
		url = "http://localhost:3000/admin/list/logs/messages/building/"
	if (kind == '2'): #list moves
		url = "http://localhost:3000/admin/list/logs/movements/building/"
	
	url = url + input("Insert building name: ")
	
	r = requests.get(url, data = payload)
	data = r.json()
	for i in data:
		print(i)
		print("\n")
	
	
	
	
def menu(secretKey):
	
	print (30 * "-" , "Menu" , 30 * "-")
	print("Select an option:\n[1] - To send buildings file,\n[2] - To list all users,\n[3] - To list all users in a building,")
	print("[4] - To list all logs,\n[5] - To list all moves,\n[6] - To list all messages,\n[7] - To filter logs by users,\n[8] - To filter logs by building")
	option = input("Please input one of the above numbers: ")
	
	if(option == '1'):
		sendFile(secretKey)
	if(option == '2'):
		listAll(secretKey)
	if(option == '3'):
		listUsersByBuilding(secretKey)
	if(option == '4'):
		listAllLogs(secretKey)
	if(option == '5'):
		listAllMoves(secretKey)
	if(option == '6'):
		listAllMsgs(secretKey)		
	if(option == '7'):
		listLogsByUser(secretKey)		
	if(option == '8'):
		listLogsByBuilding(secretKey)		
	
	
def main():
	#check version python3
	if sys.version_info[0] < 3:
		raise Exception("Please use version 3 or higher")
	
	secretKey = login() #get secret key
	while (secretKey is None):
		print ("Invalid user, try again")
		secretkey = login()
	
	print ("\nAhh, welcome back!\n")
	while(1):
		menu(secretKey)
	
	return 0

if __name__ == '__main__':
	main()

