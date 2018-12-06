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
	url = "http://127.0.0.1:3000/admin/login"
	r = requests.post(url, data = payload) #post
	key = r.json() #convert response to dictionary
	
	return key["adminkey"] #retrieve key


def menu(secretKey):
	url = "http://127.0.0.1:3000/admin/"
	
	print (30 * "-" , "Menu" , 30 * "-")
	print ("Complete the URI below:")
	uri = input(url)
	method = input("Choose option:\n1 - To Post buildings file\n2 - To Post\n3 - To Get\n4 - To Delete\n$")
	
	url = url + uri
	
	params = {}
	payload = {}
	#(se for preciso mais que uma chave pôr um ciclo)
	if (method == "1"): # Post buildings file
		with open("../data/buildings-alameda.json") as data:
			payload["building"] = json.load(data)
		payload['adminkey'] = secretKey #adds secret key to payload
		r = requests.post(url, data = payload)
	elif (method == "2"): #Post
		key = input("Insert key: ") #body post
		value = input("Insert value: ")
		payload[key] = value
		payload['adminkey'] = secretKey
		r = requests.post(url, data = payload)
	elif (method == "3"): #Get
		key = input("Insert key: ") #params to go in the url
		value = input("Insert value: ")
		params[key] = value
		payload['adminkey'] = secretKey
		r = requests.get(url, data = payload, params = params)
	#elif (method == "4")
		
	print (r) #response
		
	
	
def main():
	#check version python3
	if sys.version_info[0] < 3:
		raise Exception("Please use version 3 or higher")
	
	key = login() #get secret key

	while (key is None):
		print ("Invalid user, try again")
		key = login()
	
	print ("\nAhh, welcome back!\n")
	while(1):
		menu(key)
	
	return 0

if __name__ == '__main__':
	main()

