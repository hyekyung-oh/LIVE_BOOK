import fitz
import re
import urllib
import os
import openai
import tkinter as tk
from tkinter import filedialog
from tqdm import tqdm
import subprocess
import time

# 내용 요약 함수
def summarize_text(text):
    model_engine = "text-davinci-002"
    prompt = (f"Summarize the content in three sentences, \n\n{text}")
    completions = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=60,
        n=1,
        stop=None,
        temperature=1,
    )
    message = completions.choices[0].text.strip()
    return message

# 입력받은 책제목, 페이지, 요약된 내용을 입력 받아 이미지 생성
def createImage(summarize_text, book_title, pno) :
    try : 
        res_img = openai.Image.create(
            prompt=f'Book illustration, {summarize_text}',
            n=1,
            size="256x256"
        )
        
        img_url = res_img['data'][0]['url']
        img_path = f'../temp/{book_title}/{book_title}_{pno}.png'
        
        urllib.request.urlretrieve(img_url, img_path)
    
    except openai.error.InvalidRequestError as ex :
        
        print("예외가 발생했습니다." , ex)
        time.sleep(3)
        createImage(summarize_text, book_title, pno)

#썸네일 생성 함수
def thumnail_fromPDF(doc, book_title) :
    page = doc[0]
    img = page.get_pixmap()
    img.save(f"../temp/{book_title}/{book_title}_thumnail.png")
        
        
# ---------- main ---------- # 

# 파일 선택 윈도우 띄우기 # 
root = tk.Tk()
root.withdraw() 

# 파일 선택 다이얼로그 열기
PDF_FILE_PATH = filedialog.askopenfilename()

doc = fitz.open(PDF_FILE_PATH)

filename = os.path.basename(PDF_FILE_PATH) # 파일명 추출

print(f"선택된 파일: \n -> {filename}")

book_title = os.path.splitext(filename)[0] # 파일명에서 확장자 제거

os.makedirs(f'../temp/{book_title}', exist_ok=True)

# api 키는 push할때 초기화 됨. 동훈한테 문의해서 테스트시 api키를 받으세여
openai.api_key = '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'

# 썸네일 생성
thumnail_fromPDF(doc, book_title)

subprocess.Popen(['open', PDF_FILE_PATH])
startPno = int(input("이미지를 생성할 페이지의 시작점을 정해주세요 \n>>"))
lastPg = int(input("이미지를 생성할 마지막 페이지를 입력해주세요 \n>>"))

for pno in tqdm(range(startPno, lastPg+1)) :
    text = doc.get_page_text(pno=pno)

    
    # Preprocess text
    text = re.sub(r"\s+", " ", text)
    # Remove page number
    text = ' '.join(text.split(' ')[:-1])
    
    contents = summarize_text(text)
    print("데이터 확인!!--------")
    print(contents)
    print("데이터 확인!!--------")
    
    print(pno, "페이지 이미지 생성 중입니다.\n")
    createImage(contents, book_title, pno)
    print("성공")

