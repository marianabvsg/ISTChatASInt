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
	url = "https://asint-chat.appspot.com/admin/login"
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

def listAll(secretKey):

	payload = {}
	params = {}
	headers = {'Content-type': 'application/json'}
	payload['adminkey'] = secretKey
	
	url = "http://asint-chat.appspot.com/admin/list/users"
	#r = requests.get(url, data = payload)
	r = requests.get(url)
	print (r)
	
def listUsersByBuilding(secretKey):
	
	payload = {}
	params = {}
	payload['adminkey'] = secretKey
	headers = {'Content-type': 'application/json'}
	
	url = "https://asint-chat.appspot.com/admin/list/users/building"
	building = input("Insert building name: ")
	params['building'] = building
	r = requests.get(url, data = payload, params = params)
	print (r)
	

def menu(secretKey):
	
	print (30 * "-" , "Menu" , 30 * "-")
	print("Select an option:\n[1] - To send buildings file,\n[2] - To list all users,\n[3] - To list all users in a building")
	print("[4] - To list all logs,\n[5] - To filter logs by users,\n[6] - To filter logs by building")
	option = input("Please input one of the above numbers: ")
	
	if(option == '1'):
		sendFile(secretKey)
	if(option == '2'):
		listAll(secretKey)
	if(option == '3'):
		listUsersByBuilding(secretKey)
	if(option == '4'):
		listLogs(secretKey)
	if(option == '5'):
		listLogsByUser(secretKey)
	if(option == '6'):
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

