# -*- coding: utf-8 -*-
import fitz
from nltk import sent_tokenize
import re
import openai
import pymysql
import googletrans # pip3 install googletrans==4.0.0-rc1
import sys
import tkinter as tk
from tkinter import filedialog
import os
import time
from tqdm import tqdm
import subprocess
import requests, uuid, json

global last_insert_id

# api 키는 push할때 초기화 됨. 동훈한테 문의해서 테스트시 api키를 받으세여
<<<<<<< HEAD
openai.api_key = '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'
=======
openai.api_key = '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'

# 번역 함수
# def translate_enTokr(text) :
#     # 번역기 객체를 생성합니다.
#     translator = googletrans.Translator()
#     try :
#         outStr = translator.translate(text, dest = 'ko', src = 'en')
#         return outStr
#     except Exception as ex :
#         print("\n\n=====================")
#         print("*********** 에러가 발생했습니다 *********", ex)
#         print("=====================")
#         print("1초 후다시 시도합니다...\n\n")
        
#         time.sleep(0.5)  # 1초간 쉬기
#         return translate_enTokr(text)
>>>>>>> 5a531f95df120243c6076bc39a3ec6597f09e7fe

# 번역 함수
def translate_enTokr(text) :
    # Add your key and endpoint
    key = "bdfe8b4d4959402a8279cae4870f1368"
    endpoint = "https://api.cognitive.microsofttranslator.com"

    # location, also known as region.
    # required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    location = "koreacentral"

    path = '/translate'
    constructed_url = endpoint + path

    params = {
        'api-version': '3.0',
        'from': 'en',
        'to': ['ko']
    }

    headers = {
        'Ocp-Apim-Subscription-Key': key,
        # location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    # You can pass more than one object in body.
    body = [{
        'text': text
    }]

    request = requests.post(constructed_url, params=params, headers=headers, json=body)
    response = request.json()
    translated_text = response[0]['translations'][0]['text']
    return translated_text

# Extract the team3_BooksTitle, team3_Books_genre, and team3_Books_author from the given text and provide a query statement to insert them into the database 2023_1_pbl3.team3_Books,
# 책 정보 추출 및 query 생성 함수
def extract_book_info_and_create_query(text):
    prompt = f"Extract the team3_BooksTitle, team3_Books_genre, and team3_Books_author from the given text and provide a query statement to insert them into the database  2023_pbl3.team3_Books, and Values should be a single tuple.\n\n {text}"
    completions = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=300,
        n=1,
        stop=None,
        temperature=1,
    )
    query = completions.choices[0].text.strip()
    return query

# A부터 B까지의 내용을 요약해서 책정보 추출
def extract_AtoB(doc, rangeA, rangeB) :
    tokenized_text = []
    
    for pno in range(rangeA, rangeB):
        
        text = doc[pno].get_text()
        # 페이지의 문장들을 리스트로 저장
        tokenized_page = sent_tokenize(text)

        # 전체 본문 내용에 페이지 내용 리스트 추가
        tokenized_text += tokenized_page
    
    create_query = extract_book_info_and_create_query(tokenized_text)
    print("***책 정보를 추출하겠습니다*** \n------\n생성된 query문 \n--> " + create_query)
    print("-------------")
    print("다음과 같은 형식으로 출력되어야 합니다")
    print(">> INSERT INTO 2023_1_pbl3.team3_Books (team3_BooksTitle, team3_Books_genre, team3_Books_author) VALUES ('Title', 'Genre', 'Author');")
    print("------------------------------------------------------------------------\n")
    check = input("***관리자님이 원하는 Query문이 출력되었나요?, 종료하려면 아무키나 입력하세요.. Y/N ***: ")
    
    if check == 'Y' or check == 'y':
        return create_query
    elif check == 'N' or check == 'n':
        return extract_AtoB(doc, rangeA, rangeB)
    else:
        print("프로그램을 다시 시작해주세요.")
        sys.exit()
    
# gpt 이용 분위기 추출함수 
def extract_of_tense(text) :
    prompt = (f"다음 문장에서 분위기를 긴장, 신남, 공포, 고요, 신비 중에서 한개만 골라서 단어만 말해줘. \n\n{text}")
    completions = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=200,
        n=1,
        stop=None,
        temperature=1,
    )
    message = completions.choices[0].text.strip()
    return message

# 책 본문 내용 2줄 요약 함수
def summarize_book_content(text):
    prompt = (f"Please summarize the plot in two sentences. \n\n{text}")
    completions = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=200,
        n=1,
        stop=None,
        temperature=1,
    )
    message = completions.choices[0].text.strip()
    return message

# pdf로부터 본문내용을 페이지별로 리스트에 담는 함수
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

# A~B 내용을 두줄 요약해서 출력 및 번역된 텍스트 리턴
def print_summarize(doc,rangeA, rangeB) :
    tokenized_text = []
    for pno in range(rangeA, rangeB+1):
        text = doc[pno].get_text()
        # 페이지의 문장들을 리스트로 저장
        tokenized_page = sent_tokenize(text)
        
        # 전체 본문 내용에 페이지 내용 리스트 추가
        tokenized_text += tokenized_page
    #책 요약 정보 text 출력
    summarize_contents = summarize_book_content(tokenized_text)
    summariz_KR_contents = translate_enTokr(summarize_contents)
    print("***책 정보를 요약하겠습니다*** \n------\n" + summariz_KR_contents)
    print("------------")
    
    return summariz_KR_contents

def Insert_Sql(PDF_FILE_PATH, doc ,SQLcontents, update_summarize_data) :
    # db연결 설정
    db = pymysql.connect(host='selab.hknu.ac.kr',
                        port=51714,
                        user='pbl3_team3',
                        passwd='12345678',
                        db='2023_pbl3',
                        charset='utf8'
                        )

    # 커서 생성 
    cursor = db.cursor()
    
    Book_text_list = get_pdf_page_text(doc)
    
    # SQL 책의 정보를 입력 query 실행
    try :
        # openAI가 추출한 책 정보
        sql = f"""{SQLcontents}"""
        cursor.execute(sql)
        
        # 데이터 삽입 후, 마지막으로 생성된 primary key 값을 가져옴
        last_insert_id = cursor.lastrowid
    except Exception as ex :
        print("다음과 같은 error가 발생했습니다 ", ex)
        print("잘못된 SQL 구문을 입력했습니다. 다시 프로그램을 실행해주세요.")
        sys.exit()
        
    # try에서 저장한 변수를 다음 for문에서 쓰기위해 살려두자..
    last_insert_id = last_insert_id
    
    subprocess.Popen(['open', PDF_FILE_PATH])
    
    # 본문 페이지 지정하면 됨
    while(True) :
        print(f"이 책의 분량은 0 ~ {len(Book_text_list)} 페이지입니다.")
        try :
            startPno = int(input("테이블에 입력할 페이지의 시작점을 정해주세요 \n>>"))
            lastPg = int(input("테이블에 입력할 마지막 페이지를 입력해주세요 \n>>"))
            
            if startPno < 0 and startPno > len(Book_text_list) : # 시작 페이지가 0보다 작은 잘못된 값이 들어왔을 때
                print("시작페이지 정보를 다시 입력해주세요!! ")
                continue
            
            if lastPg > len(Book_text_list) : # 입력한 마지막 페이지 값이 책분량보다 클 때
                print(f"마지막 페이지 정보를 다시 입력해주세요!! 이 책의 분량은 {len(Book_text_list)}pg 입니다")
                continue
                
            else :
                print("\n원하는 값을 입력했는지 확인해주세요\n")
                print(f"시작 페이지 : {startPno}page, 마지막 페이지 : {lastPg}page\n")
                
                check = input("맞나요 ? (Y/N) >> ")
                if check == 'Y' or check == 'y':
                    break
                elif check == 'N' or check == 'n':
                    continue
                
        except Exception as ex :
            print("다음과 같은 에러가 발생했습니다 : ", ex)
            print("1초 뒤 다시 시도합니다..")
            time.sleep(1)
            Insert_Sql(doc ,SQLcontents, update_summarize_data)
            
    
    filename = os.path.basename(PDF_FILE_PATH) # 파일명 추출
    book_title = re.sub(r"\.[^.]+$", "", filename) # 확장자명 제거
    thumnail_path = f'../public/temp/{book_title}/{book_title}_thumnail.png'
    
    # 책의 요약을 추가할 SQL query
    update_sql = "UPDATE team3_Books SET team3_BooksInfo = %s, team3_Books_Thumnail = %s WHERE team3_BooksID = %s"
    
    
    values = (update_summarize_data, thumnail_path ,last_insert_id)

    # Books_Info 입력 sql query 실행
    cursor.execute(update_sql, values)
    
    # -------------- 여기까지 책정보까지 입력완료!! 페이지 정보는 아래서부터 입력 --------------------#
            

    # 지정된 범위만큼 for문 돈다 team3_Books_Imgs_Pages의 각 페이지 입력
    for page in tqdm(range(int(startPno), int(lastPg)+1)) :
        currntPg = page
        SelectPage_text_list = Book_text_list[currntPg-1]
        
        page_FullText = ""
        
        print("----------------------------")
        print(str(page) + " 페이지 DB입력 중...")
        print("----------------------------")
        
        # 선택한 페이지 리스트의 문장 갯수만큼 for문 
        for j in tqdm(range(0, len(SelectPage_text_list))) :
            
            # 페이지리스트의 j번째 문장의 공백을 제거한 new_text
            new_text = re.sub(r'\s', ' ', SelectPage_text_list[j])
            # 공백 제거된 문장을 한글로 번역
            kr_text = translate_enTokr(new_text)
            
            #진행상황 확인 ㅋㅋ..
            # print(kr_text)
            page_FullText += kr_text + " "
        
        print(f"입력될 {str(page)} 페이지 contents \n ----> {page_FullText}")   
        
        filename = os.path.basename(PDF_FILE_PATH) # 파일명 추출
        filename = re.sub(r"\.[^.]+$", "", filename) # 확장자명 제거
       
        #불러올 이미지 경로
        filePath =f"../public/temp/{filename}/{page}.png" 
        
        # team3_Books_Imgs_Pages 테이블에 입력
        # 쿼리 문장
        # sql_query = "INSERT INTO team3_Imgs_Pages (team3_BooksID, team3_page_number, team3_text, team3_imgPath) VALUES (%s, %s, %s, %s)"
        sql_query = "INSERT INTO team3_Imgs_Pages (team3_BooksID, team3_page_number, team3_text, team3_imgPath, team3_textTense) VALUES (%s, %s, %s, %s, %s)"
        
        # SQL query 실행
        with db.cursor() as cursor:
            # 변수 값
            team3_BooksID = last_insert_id
            team3_page_number = page
            team3_text = page_FullText
            team3_imgPath = filePath
            team3_textTense = extract_of_tense(page_FullText)
            # 쿼리 실행
            cursor.execute(sql_query, (team3_BooksID, team3_page_number, team3_text, team3_imgPath,team3_textTense))
        
<<<<<<< HEAD
        time.sleep(0.5)  #0.5초 
        print("분위기 추축 결과 : ", team3_textTense)
=======
        # time.sleep(0.5)  #0.5초 
        print("분위기 추측 결과 : ", team3_textTense)
>>>>>>> 5a531f95df120243c6076bc39a3ec6597f09e7fe
        print("----------------------------")
        print(f"********************* {filename} : {page} 페이지 DB입력 완료 ********************* ")
    
    # 데이터 변화 적용
    db.commit()
    print("성공적으로 team3_Books 테이블의 데이터를 입력하였습니다!")
    
# gpt 이용 분위기 추출함수
def extract_of_tense(text) :
    prompt = f"다음 문장에서 분위기를 긴장, 신남, 공포, 고요, 신비, 행복, 슬픔 중에서 한개만 골라줘. \n\n{text}"
    completions = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=200,
        n=1,
        stop=None,
        temperature=1,
    )
    message = completions.choices[0].text.strip()
    
    
    if "긴장" in message : 
        result = "긴장"
    elif "신남" in message :
        result = "신남"
    elif "공포" in message :
        result = "공포"
    elif "고요" in message :
        result = "고요"
    elif "신비" in message :
        result = "신비"
    elif "행복" in message :
        result = "행복"
    elif "슬픔" in message :
        result = "슬픔"
    else :
        result = "실패"
    
    return result


#-------- main --------#
root = tk.Tk()
root.withdraw() # tkinter root window를 숨김

# 파일 선택 다이얼로그 열기
PDF_FILE_PATH = filedialog.askopenfilename()

filename = os.path.basename(PDF_FILE_PATH) # 파일명 추출

print(f"선택된 파일: \n -> {filename}")

doc = fitz.open(PDF_FILE_PATH)

# doc의 0~4페이지 책정보 추출
extractData = extract_AtoB(doc, 0, 3)

# doc의 5~7페이지로부터 내용 요약 출력 및 리턴 
update_summarize_data = print_summarize(doc, 6, 7)

# 추출한 정보를 입력 후2, 그 행에 요약정보(Info)를 추가함
Insert_Sql(PDF_FILE_PATH, doc, extractData, update_summarize_data)

