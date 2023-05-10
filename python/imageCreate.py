import fitz
import re
import urllib
import os
import openai
import sys
import tkinter as tk
from tkinter import filedialog

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

count = 0
start_pno = 5

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

# 각 페이지를 요약내용 바탕 이미지 생성
for pno in range(start_pno, doc.page_count) :
    text = doc.get_page_text(pno=pno)

    # Preprocess text
    text = re.sub(r"\s+", " ", text)
    # Remove page number
    text = ' '.join(text.split(' ')[:-1])
    
    res_img = openai.Image.create(
        prompt=f'Book illustration, {summarize_text(doc[pno])}',
        n=1,
        size="256x256"
    )
    
    img_url = res_img['data'][0]['url']
    img_path = f'../temp/{book_title}/{pno}.png'
    
    urllib.request.urlretrieve(img_url, img_path)


