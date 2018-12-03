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


def menu(key):
	url = "http://127.0.0.1:3000/admin/"
	
	print (30 * "-" , "Menu" , 30 * "-")
	print ("Complete the URI below:")
	uri = input(url)
	method = input("Choose method [POST] [GET] [DELETE]: ")
	
	url = url + uri

	if (method == "POST"):
		with open("../data/buildings-alameda.json") as data:
			payload = json.load(data)
		payload['adminkey'] = key #adds secret key to payload
		r = requests.post(url, data = payload)
	else:
		params = input("Insert url params in the: {'key':'value'} format") #params to go in the url
		payload = {'adminkey':key} #secret key
		r = requests.get(url, data = payload, params = params)
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

