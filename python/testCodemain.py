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
import pymysql
from PIL import Image
import base64
from io import BytesIO
import time

# api 키는 push할때 초기화 됨. 동훈한테 문의해서 테스트시 api키를 받으세여
openai.api_key = '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'

# 번역 함수
def translate_enTokr(text) :
    # 번역기 객체를 생성합니다.
    translator = googletrans.Translator()
    try :
        outStr = translator.translate(text, dest = 'ko', src = 'en')
        return outStr
    except Exception as ex :
        print("\n\n=====================")
        print("*********** 에러가 발생했습니다 *********", ex)
        print("=====================")
        print("3초 후다시 시도합니다...\n\n")
        
        time.sleep(3)  # 3초간 쉬기
        return translate_enTokr(text)

# 토큰 낭비 줄이기 위한 테스트 코드 !!!!!!!! 
def TEST_extract_book_info_and_create_query():
    return "INSERT INTO 2023_1_pbl3.team3_Books (team3_BooksTitle, team3_Books_genre, team3_Books_author) VALUES ('Title', 'Genre', 'Author');"

# A부터 B까지의 내용을 요약해서 책정보 추출
def extract_AtoB(doc, rangeA, rangeB) :
    tokenized_text = []
    
    for pno in range(rangeA, rangeB+1):
        
        text = doc[pno].get_text()
        # 페이지의 문장들을 리스트로 저장
        tokenized_page = sent_tokenize(text)

        # 전체 본문 내용에 페이지 내용 리스트 추가
        tokenized_text += tokenized_page
    
    create_query = TEST_extract_book_info_and_create_query()
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
    for pno in range(rangeA, rangeB):
        text = doc[pno].get_text()
        # 페이지의 문장들을 리스트로 저장
        tokenized_page = sent_tokenize(text)

        # 페이지의 마지막 문장이 "."로 끝나지 않는 경우, 
        # 다음 페이지의 첫 문장과 합쳐서 하나의 문장으로 처리
        if pno != doc.page_count-1 and not tokenized_page[-1].endswith("."):
            next_page_text = doc[pno+1].get_text()
            next_page_first_sentence = sent_tokenize(next_page_text)[0]
            next_page_first_sentence = next_page_first_sentence[3:]
            
        tokenized_page[-1] = re.sub(r'or Media, Inc.*', '', tokenized_page[-1], flags=re.DOTALL)
        tokenized_page[-1] = tokenized_page[-1] + next_page_first_sentence

        # 전체 본문 내용에 페이지 내용 리스트 추가
        tokenized_text += tokenized_page
    #책 요약 정보 text 출력
    # summarize_contents = summarize_book_content(tokenized_text)
    summariz_KR_contents = "음.. 테스트 내용 요약입니다. 아아 테스트 테스트"
    print("***책 정보를 요약하겠습니다*** \n------\n" + summariz_KR_contents)
    print("------------")
    
    return summariz_KR_contents

def Insert_Sql(doc ,SQLcontents, update_summarize_data) :
    # db연결 설정
    db = pymysql.connect(host='selab.hknu.ac.kr',
                        port=51714,
                        user='pbl3_team3',
                        passwd='12345678',
                        db='2023_1_pbl3',
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
                print("원하는 값을 입력했는지 확인해주세요")
                print(f"시작 페이지 : {startPno}page, 마지막 페이지 : {lastPg}page")
                
                check = input("맞나요 ? (Y/N) >> ")
                if check == 'Y' or check == 'y':
                    break
                elif check == 'N' or check == 'n':
                    continue
                
        except Exception as ex :
            print("다음과 같은 에러가 발생했습니다 : ", ex)
            print("3초 뒤 다시 시도합니다..")
            time.sleep(3)
            Insert_Sql(doc ,SQLcontents, update_summarize_data)
            
        
    # 지정된 범위만큼 for문 돈다 
    for i in tqdm(range(int(startPno), int(lastPg))) :
        currntPg = i
        SelectPage_text_list = Book_text_list[currntPg-1]
        
        page_FullText = ""
        
        # 책의 요약을 추가할 SQL query
        update_sql = "UPDATE team3_Books SET team3_BooksInfo = %s WHERE team3_BooksID = %s"
        values = (update_summarize_data, last_insert_id)

        # Books_Info 입력 sql query 실행
        cursor.execute(update_sql, values)
        
        print("----------------------------")
        print(str(i) + " 페이지 DB입력 중...")
        print("----------------------------")
        
        # 선택한 페이지 리스트의 문장 갯수만큼 for문 
        for j in tqdm(range(0, len(SelectPage_text_list))) :
            
            # 페이지리스트의 j번째 문장의 공백을 제거한 new_text
            new_text = re.sub(r'\s', ' ', SelectPage_text_list[j])
            # 공백 제거된 문장을 한글로 번역
            kr_text = translate_enTokr(new_text).text
            
            #진행상황 확인 ㅋㅋ..
            # print(kr_text)
            page_FullText += kr_text + " "
        
        print(f"입력될 {str(i)} 페이지 contents \n ----> {page_FullText}")    
    
        insert_text_sql = f"INSERT INTO  2023_1_pbl3.team3_Imgs_Pages (team3_BooksID, team3_page_number, team3_text) VALUES ('{last_insert_id}', '{i}', '{page_FullText}');"
        # SQL query 실행
        cursor.execute(insert_text_sql)
        
        time.sleep(3)  # 3초간 쉬기
        print("----------------------------")
        print(f"********************* {filename} : {i} 페이지 DB입력 완료 ********************* ")
    
    
    
    
    # 데이터 변화 적용
    db.commit()
    print("성공적으로 team3_Books 테이블의 데이터를 입력하였습니다!")


#--------------------- main ----------------------#
root = tk.Tk()
root.withdraw() # tkinter root window를 숨김

# 파일 선택 다이얼로그 열기
PDF_FILE_PATH = filedialog.askopenfilename()

filename = os.path.basename(PDF_FILE_PATH) # 파일명 추출

print(f"선택된 파일: \n -> {filename}")

doc = fitz.open(PDF_FILE_PATH)

# # doc의 0~4페이지 책정보 추출
extractData = extract_AtoB(doc, 0, 3)

# doc의 5~7페이지로부터 내용 요약 출력 및 리턴 
update_summarize_data = print_summarize(doc, 6, 8)

# 추출한 정보를 입력 후, 그 행에 요약정보(Info)를 추가함
Insert_Sql(doc, extractData, update_summarize_data)

