#!/usr/bin/python3
import requests
import json
import sys
import os
script_dir = os.path.dirname(__file__)

# comment or uncomment depending if you're running the server locally or in the cloud
url = "https://asint-chat.appspot.com/"
#url = "http://127.0.0.1:3000/"


def login():
	print (30 * "-" , "Login" , 30 * "-")
	
	#verificado pelo servidor
	user = input("Username: ")
	password = input("Password: ")
	
	payload = {'username':user, 'password':password}
	endpoint = url + "admin/login"
	r = requests.post(endpoint, data = payload) #post
	key = r.json() #convert response to dictionary

	return key["adminkey"] #retrieve key


def sendFile(secretKey):
	
	payload = {}
	params = {}
	headers = {'Content-type': 'application/json'}
	payload['adminkey'] = secretKey

	endpoint = url + "admin/building"

	print("Warning: the JSON file must be in the data/ directory")
	name_of_file = input("Name of the JSON file: ")

	relative_path = "../data/" + name_of_file

	file_path = os.path.join(script_dir, relative_path)

	try:
		with open(file_path, 'r') as data:
			payload['building'] = json.load(data)
		r = requests.post(endpoint, headers = headers, data = json.dumps(payload))
		print(r.status_code)
	except FileNotFoundError as e:
		print("File not found!")
	


#list all logged users
def listAll(secretKey):

	payload = {}
	params = {}
	headers = {'Content-type': 'application/json'}
	payload['adminkey'] = secretKey
	
	endpoint = url + "admin/list/users"
	r = requests.get(endpoint, params = payload)
	#print(r)
	#print only name - id
	data = r.json()
	if data is None:
		return
	
	for i in data:
		if i["building"] is None:
			print("\n" + i['ist_id'] + " - " + i['name'] + " - Not in any building")
		else:
			print("\n" + i['ist_id'] + " - " + i['name'] + " - " + i["building"])


#list all move logs
def listAllMoves(secretKey):
	
	payload = {}
	params = {}
	headers = {'Content-type': 'application/json'}
	payload['adminkey'] = secretKey
	
	endpoint = url + "admin/list/logs/movements"

	r = requests.get(endpoint, params = payload)
	#print only name - id
	data = r.json()
	if data is None:
		return
	
	for i in data:
		print(i)
		print("\n")
		
def listAllMsgs(secretKey):
	
	payload = {}
	params = {}
	headers = {'Content-type': 'application/json'}
	payload['adminkey'] = secretKey
	
	endpoint = url + "admin/list/logs/messages"

	r = requests.get(endpoint, params = payload)
	#print only name - id
	data = r.json()
	if data is None:
		return
	
	for i in data:
		print(i)
		print("\n")
	
#list all users in a selected building
def listUsersByBuilding(secretKey):
	
	payload = {}
	params = {}
	payload['adminkey'] = secretKey
	headers = {'Content-type': 'application/json'}

	endpoint = url + "admin/list/users/building/" + input("Insert building name: ") #update url with building selected
	
	r = requests.get(endpoint, params = payload)
	
	if	r.status_code == 200:
		data = r.json()
		if data is None:
			return
			
		for i in data:
			print("\n" + i['ist_id'])
	else:
		print("\n Building doesn't exist.")
	
def listAllLogs(secretKey):
	
	payload = {}
	params = {}
	payload['adminkey'] = secretKey
	headers = {'Content-type': 'application/json'}

	endpoint = url + "admin/list/logs"
	
	r = requests.get(endpoint, params = payload)
	data = r.json()
	if data is None:
		return
		
	for i in data:
		print(i)
		print("\n")
	
def listLogsByUser(secretKey):
	
	payload = {}
	params = {}
	payload['adminkey'] = secretKey
	headers = {'Content-type': 'application/json'}
	endpoint = ""
	
	#url = "https://asint-chat.appspot.com/admin/list/users/building/"
	
	kind = input("[1] - Messages\n[2] - Moves\n[3] - All\nOption: ")
	if (kind == '1'): #list messages
		endpoint = url + "admin/list/logs/messages/user/"
	elif (kind == '2'): #list moves
		endpoint = url + "admin/list/logs/movements/user/"
	elif (kind == '3'):
		endpoint = url + "admin/list/logs/user/"
	else:
		print("Choose a valid option")
		return
	
	endpoint = endpoint + input("Insert user id: ") #updated url with selected user
	
	r = requests.get(endpoint, params = payload)
	data = r.json()
	if data is None:
		return
		
	for i in data:
		print(i)
		print("\n")

	
def listLogsByBuilding(secretKey):
	
	payload = {}
	params = {}
	payload['adminkey'] = secretKey
	headers = {'Content-type': 'application/json'}
	endpoint = ""
	
	#url = "https://asint-chat.appspot.com/admin/list/users/building/"
	kind = input("[1] - Messages\n[2] - Moves\n[3] - All\nOption: ");
	if (kind == '1'): #list messages
		endpoint = url + "admin/list/logs/messages/building/"
	elif (kind == '2'): #list moves
		endpoint = url + "admin/list/logs/movements/building/"
	elif (kind == '3'): #list all
		endpoint = url + "admin/list/logs/building/"
	else:
		print("Choose a valid option")
		return
		
	endpoint = endpoint + input("Insert building name: ")
	
	r = requests.get(endpoint, params = payload)

	if	r.status_code == 200:
		data = r.json()
		if data is None:
			return
		
		for i in data:
			print(i)
			print("\n")
	
def createBot(secretKey):
	payload = {}
	params = {}
	headers = {'Content-type': 'application/json'}
	payload['adminkey'] = secretKey
	payload['building'] = input("Insert building name: ")
	
	endpoint = url + 'admin/bot'

	r = requests.post(endpoint, data = payload) #post

	if r.status_code == 403:
		print("Building not found.")
	else:
		print (r.json())
		
def changeBuildingRange(secretKey):
	payload = {}
	params = {}
	headers = {'Content-type': 'application/json'}
	payload['adminkey'] = secretKey
	payload['building_range'] = input("Insert new building range: ")
	
	endpoint = url + 'admin/building/range'
	
	r = requests.post(endpoint, data = payload) #post
	
	if r.status_code == 200:
		print("Success")
	else:
		print("Not updated")
	
	
def menu(secretKey):
	
	print (30 * "-" , "Menu" , 30 * "-")
	print("Select an option:\n[1] - To send buildings file,\n[2] - To list all users,\n[3] - To list all users in a building,")
	print("[4] - To list all logs,\n[5] - To list all moves,\n[6] - To list all messages,\n[7] - To filter logs by users,")
	print("[8] - To filter logs by building,\n[9] - To create a new bot\n[10] - To change buildings' default range.")
	option = input("Please input one of the above numbers: ")
	
	if(option == '1'):
		sendFile(secretKey)
	elif(option == '2'):
		listAll(secretKey)
	elif(option == '3'):
		listUsersByBuilding(secretKey)
	elif(option == '4'):
		listAllLogs(secretKey)
	elif(option == '5'):
		listAllMoves(secretKey)
	elif(option == '6'):
		listAllMsgs(secretKey)		
	elif(option == '7'):
		listLogsByUser(secretKey)		
	elif(option == '8'):
		listLogsByBuilding(secretKey)		
	elif(option == '9'):
		createBot(secretKey)		
	elif(option == '10'):
		changeBuildingRange(secretKey)
	else:
		print("Please select an option 1 to 10")		
	
	
def main():
	#check version python3
	if sys.version_info[0] < 3:
		raise Exception("Please use version 3 or higher")
	
	secretKey = login() #get secret key
	while (secretKey is None):
		print ("Invalid user, try again")
		secretKey = login()
	
	print ("\nAhh, welcome back!\n")
	while(1):
		menu(secretKey)
		print("\n")
	
	return 0

if __name__ == '__main__':
	main()

