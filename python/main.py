import fitz
from nltk import sent_tokenize
import re
import openai
import pymysql
import googletrans
import sys
import tkinter as tk
from tkinter import filedialog
import os

# api 키는 push할때 초기화 됨. 동훈한테 문의해서 테스트시 api키를 받으세여
openai.api_key = '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'

# 번역 함수
def translate_enTokr(text) :
    # 2. 번역기 객체를 생성합니다.
    translator = googletrans.Translator()
    # 4. 라이브러리를 사용하여 번역합니다.
    outStr = translator.translate(text, dest = 'ko', src = 'en')
    return outStr.text


# Extract the team3_BooksTitle, team3_Books_genre, and team3_Books_author from the given text and provide a query statement to insert them into the database 2023_1_pbl3.team3_Books,
# 책 정보 추출 및 query 생성 함수
def extract_book_info_and_create_query(text):
    prompt = f"Extract the team3_BooksTitle, team3_Books_genre, and team3_Books_author from the given text and provide a query statement to insert them into the database  2023_1_pbl3.team3_Books, and Values should be a single tuple.\n\n {text}"
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
def insert_query(doc, rangeA, rangeB) :
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
    
    check = input("***관리자님이 원하는 Query문이 출력되었나요? Y/N ***: ")
    
    if check == 'Y' or check == 'y':
        return create_query
    elif check == 'N' or check == 'n':
        return insert_query(doc, rangeA, rangeB)
    else:
        print("프로그램을 다시 시작해주세요.")
        sys.exit()
    


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
    summarize_contents = summarize_book_content(tokenized_text)
    print("***책 정보를 요약하겠습니다*** \n------\n" + translate_enTokr(summarize_contents))
    print("------------")
    
    return translate_enTokr(summarize_contents)

def Insert_Sql(SQLcontents, update_summarize_data) :
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

    sql = f"""{SQLcontents}"""

    # SQL query 실행
    cursor.execute(sql)
    
    # 데이터 삽입 후, 마지막으로 생성된 primary key 값을 가져옴
    last_insert_id = cursor.lastrowid

    # 책의 내용을 추가할 SQL query
    update_sql = "UPDATE team3_Books SET team3_BooksInfo = %s WHERE team3_BooksID = %s"
    values = (update_summarize_data, last_insert_id)

    cursor.execute(update_sql, values)

    # 데이터 변화 적용
    db.commit()
    print("성공적으로 database에 데이터를 입력하였습니다!")


root = tk.Tk()
root.withdraw() # tkinter root window를 숨김

# 파일 선택 다이얼로그 열기
PDF_FILE_PATH = filedialog.askopenfilename()

filename = os.path.basename(PDF_FILE_PATH) # 파일명 추출

print(f"선택된 파일: \n -> {filename}")

doc = fitz.open(PDF_FILE_PATH)

# # doc의 0~4페이지 책정보 추출
extractData = insert_query(doc, 0, 4)

# doc의 5~7페이지로부터 내용 요약 출력 및 리턴 
update_summarize_data = print_summarize(doc, 5, 7)

# 추출한 정보를 입력 후, 그 행에 요약정보(Info)를 추가함
Insert_Sql(extractData, update_summarize_data)
