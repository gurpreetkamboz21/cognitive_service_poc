import json
from objectpath import Tree
import pandas as pd
import csv
from flask import request
import pickle

file1 = open("process_forms\\file.txt","r")  
txt = file1.read()
arrayList = json.loads(txt)
#jsonObject = json.loads(txt)

#column_namescolumn_names=("ShipTo","SoldBy","Terms","CIN","OrderID","CustmerID","ServiceTax","VAT","CompanyName","BillTo","InvoiceNo","InvoiceDate","PAN","TotalAmount", "BalanceDue", "GST")
json_response=[]
json_element={}
for jsonObject in arrayList:
    for key in jsonObject.items(): 
        if (type(key[1])!= str):
            json_element[key[0]]= key[1]['text'].replace(',', '')
            print(json_element)
    json_response.append(json_element)
print(json.dumps(json_response))


def readSimpleJson():  
    with open('process_forms\\simple.json') as json_file: 
        data = json.load(json_file) 
    employee_data = data['emp_details'] 
    data_file = open('data_file.csv', 'w') 
    csv_writer = csv.writer(data_file) 
    count = 0
    print(type(employee_data))
    for emp in employee_data: 
        print(type(emp))#Dic
        if count == 0: 
            header = emp.keys() 
            print(header)
            csv_writer.writerow(header) 
            count += 1

        # Writing data of CSV file 
        csv_writer.writerow(emp.values()) 
    
    data_file.close()   



#readSimpleJson()
