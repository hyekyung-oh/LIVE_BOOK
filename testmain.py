import fitz
import re
from pydub import AudioSegment
import os
from gtts import gTTS
import kss

# pip install PyMuPDF
# pip install pyttsx3

# 총 2074 pg 분량의 동화 모음집 
PDF_FILE_PATH = "./data/TallGuysStory.pdf"

doc = fitz.open(PDF_FILE_PATH)

#print_text 함수
def print_text(insert_Pg) :
    print("------------------------------------")
    print("입력한 페이지는", insert_Pg, "page 입니다.")
    print("------------------------------------")
    insert_Pg = int(insert_Pg)
    page = doc[insert_Pg]
    text = page.get_text()

     # 페이지 넘버 제거
    text = text[1:]
    
    index = 0
    
    # 한글 문장 분리
    for sentence in kss.split_sentences(text) :
        print(str(index) + ". "+  sentence)
        index = index + 1
    
    

    # page의 내용의 공백과 숫자를 " "로 전처리
    text = re.sub(r'^\w', "", text)
    return text

# mp3 저장 함수
def save_mp3(text, insert_Pg) :
    
    # 저장할 파일 이름 지정
    save_file_name = f'./data/mp3/{insert_Pg}page.mp3'

    # 다른 tts 라이브러리 활용 ,, 
    tts = gTTS(text, lang = 'ko')
    tts.save(save_file_name)

    if os.path.isfile(save_file_name) == True : 
        print(f"성공적으로 {insert_Pg}page의 파일이 저장되었습니다.")
        return save_file_name
    else : 
        print("파일 저장에 실패했습니다.")
    

# 페이지 입력 받는 함수
def get_Page() : 
    insert_Pg = input("원하는 페이지를 입력하세요 >> ")
    # 맨끝 쪽 정보 저장
    max_Page = doc.page_count 
    print("책의 분량은 ", max_Page, "입니다.")
    
    return insert_Pg

while (True) :
    
    insert_Pg = get_Page()    
    
    text = print_text(insert_Pg)
    
    print(text)
    
    # #서버로 전송할 파일의 경로를 saveFIle_path 에 저장
    # saveFile_path = save_mp3(text, insert_Pg)
    # print(f'{saveFile_path}에서 파일을 가져올 수 있습니다.')
    
    player_input = input("\n읽기를 종료하려면 q, 더 읽고 싶다면 아무키나 입력하세요 >>")
    if(player_input == 'q') :
        print("\n이용해주셔서 감사합니다.")
        break
    else :
        insert_Pg = int(insert_Pg) + 1
        