import googletrans
# pip3 install googletrans==4.0.0-rc1
import fitz
from nltk import sent_tokenize
import sys
import tkinter as tk
from tkinter import filedialog
import os
import pymysql
import re
import time

# AttributeError: 'Translator' object has no attribute 'raise_Exception'
# 현재 Google 번역 API는 초당 5회 호출을 허용하고 하루에 200k로 제한합니다.
# 번역 함수
def translate_enTokr(text) :
    # 번역기 객체를 생성합니다.
    translator = googletrans.Translator()
    try :
        outStr = translator.translate(text, dest = 'ko', src = 'en')
        return outStr
    except Exception as ex :
        print("\n\n=====================")
        print("***********에러가 발생했습니다*********", ex)
        print("=====================")
        print("3초 후다시 시도합니다...\n\n")
        
        time.sleep(3)  # 3초간 쉬기
        return translate_enTokr(text)
        

def get_pdf_page_text(doc) :
    # ex) contents_text[1] 는 1페이지의 문장 리스트를 담고 있습니다
    # 따라서 1페이지의 1번째 문장을 불러오고 싶다면 contents_text[1][0] 으로 불러오면 됩니다.
    contents_text = []
    # 본문 내용을 변수에 리스트형태로 담음
    for pno in range(doc.page_count):
        
        text = doc[pno].get_text()
        # 페이지의 문장들을 리스트로 저장
        contents_page = sent_tokenize(text)

        # 전체 본문 내용에 페이지 내용 리스트 추가
        contents_text.append(contents_page)
    return contents_text

root = tk.Tk()
root.withdraw() # tkinter root window를 숨김

# 파일 선택 다이얼로그 열기
PDF_FILE_PATH = filedialog.askopenfilename()

filename = os.path.basename(PDF_FILE_PATH) # 파일명 추출

print(f"선택된 파일: \n -> {filename}")

doc = fitz.open(PDF_FILE_PATH)

Book_text_list = get_pdf_page_text(doc)

print(str(len(Book_text_list)) + "page분량의 책")

# 페이지 개수만큼 for문 돈다 len(Book_text_list)
for i in range(0, len(Book_text_list)) :
    currntPg = i
    SelectPage_text_list = Book_text_list[currntPg-1]
    
    page_FullText = ""
    print("----------------------------")
    print(str(i) + " page번째 I for문 도는 중")
    print("----------------------------")
    
    print(str(len(SelectPage_text_list)) + "개의 문장 리스트를 가집니다.")
    
    # 선택한 페이지 리스트의 문장 갯수만큼 for문 
    for j in range(0, len(SelectPage_text_list)) :
        
        print(str(i) + " page의 " + str(j) + "번쨰 J for문 도는중")
        
        # 페이지리스트의 j번째 문장의 공백을 제거한 new_text
        new_text = re.sub(r'\s', ' ', SelectPage_text_list[j])
        # 공백 제거된 문장을 한글로 번역
        kr_text = translate_enTokr(new_text).text
        
        #진행상황 확인 ㅋㅋ..
        print(kr_text)
        
        page_FullText += kr_text + " "


# # db연결 설정
# db = pymysql.connect(host='selab.hknu.ac.kr',
#                     port=51714,
#                     user='pbl3_team3',
#                     passwd='12345678',
#                     db='2023_1_pbl3',
#                     charset='utf8'
#                     )

# # 커서 생성
# cursor = db.cursor()

# sql = f"INSERT INTO  2023_1_pbl3.team3_Imgs_Pages (team3_BooksID, team3_page_number, team3_text) VALUES ('{2}', '{insert_Pg-1}', '{page_FullText}');"

#  # SQL query 실행
# cursor.execute(sql)
# # 데이터 변화 적용
# db.commit()
# print(f"성공적으로 {insert_Pg-1}페이지의 내용을 database에 데이터를 입력하였습니다!")

