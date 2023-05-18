import pymysql
from PIL import Image
import base64
from io import BytesIO
import time
import tkinter as tk
from tkinter import filedialog
import fitz
import os
import re


# https://limjunho.github.io/2020/07/14/MySql-insert-image.html

def convertToBinaryData(filename):
    # Convert digital data to binary format
    with open(filename, 'rb') as file:
        binaryData = file.read()
    return binaryData

# 데이터베이스에 이미지 파일을 입력, team3_BooksID는 외래키, id는 autoIncreament, 
def insertBLOB(Photo_FilePath, team3_BooksID, id):
    print("Inserting BLOB into images table")

    # db연결 설정
    db = pymysql.connect(host='selab.hknu.ac.kr',
                        port=51714,
                        user='pbl3_team3',
                        passwd='12345678',
                        db='2023_pbl3',
                        charset='utf8'
                        )

    
    cursor = db.cursor()
    
    
    Picture = convertToBinaryData(Photo_FilePath)
    
    # page에 해당하는 이미지와 BookID를 
    sql_insert_blob_query = "UPDATE 2023_pbl3.team3_Imgs_Pages SET team3_img = %s, team3_BooksID = %s WHERE team3_id = %s;"

    cursor.execute(sql_insert_blob_query, (Picture, team3_BooksID, id))
    
    db.commit()

root = tk.Tk()
root.withdraw() # tkinter root window를 숨김

# 파일 선택 다이얼로그 열기
PDF_FILE_PATH = filedialog.askopenfilename()

filename = os.path.basename(PDF_FILE_PATH) # 파일명 추출
filename = re.sub(r"\.[^.]+$", "", filename) # 확장자명 제거

print(f"선택된 파일: \n -> {filename}")

doc = fitz.open(PDF_FILE_PATH)

print(filename)


filePath =f"../temp/{filename}/{5}.png"
print(convertToBinaryData(filePath))


# # img, team3_BooksID(주키), 어디에? team3_id
# insertBLOB(filePath,1,2)


