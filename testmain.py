import fitz
import pyttsx3
import re
from pydub import AudioSegment
import os
 
# pip install PyMuPDF
# pip install pyttsx3

# 총 2074 pg 분량의 동화 모음집 
PDF_FILE_PATH = "./data/kidsStorySample.pdf"

doc = fitz.open(PDF_FILE_PATH)

# tts 속성 변경
engine = pyttsx3.init()


# 기본 설정 값 지정
Speak_speed = 500
Speak_Volume = 1

# 말하는 속도 50 정도가 적당
engine.setProperty("rate", Speak_speed)
rate = engine.getProperty("rate")

# 소리 크기
engine.setProperty("volume", Speak_Volume)  # 0~1
volume = engine.getProperty("volume")

#tts 스피커 함수 (필요하면 음성 모델 변경)
def Speaker(text) :
    # tts 출력
        engine.say(text)
        engine.runAndWait()

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

    # page의 내용의 공백과 숫자를 " "로 전처리
    text = re.sub(r'^\w', "", text)
    return text

# mp3 저장 함수
def save_mp3(text, insert_Pg) :
    
    # .wav 일땐 잘 저장됨. mp3만 안됨.
    save_file_name = f'./data/mp3/{insert_Pg}page.wav'
    
    engine.save_to_file(text, save_file_name)
    engine.runAndWait()

#     convert_To_Mp3_file = AudioSegment.from_wav(save_file_name)
#     convert_To_Mp3_file.export(f'{save_file_name[:-4]}.mp3', format="mp3")
    
#     if os.path.isfile(f'{save_file_name[:-4]}.mp3') == True : 
#         print(f"성공적으로 {insert_Pg}page의 mp3가 저장되었습니다.")
#     else : 
#         print("파일 저장에 실패했습니다.")
    
    if os.path.isfile(save_file_name) == True : 
        print(f"성공적으로 {insert_Pg}page의 mp3가 저장되었습니다.")
    else : 
        print("파일 저장에 실패했습니다.")


# ------프로그램 시작 ---------- # 
insert_Pg = input("원하는 페이지를 입력하세요 >> ")

# 맨끝 쪽 정보 저장
max_Page = doc.page_count 
print("책의 분량은 ", max_Page, "입니다.")

while (True) :
    
    text = print_text(insert_Pg)
    
    print(text)
    save_mp3(text, insert_Pg)
    Speaker(text)
    
    player_input = input("읽기를 종료하려면 q, 더 읽고 싶다면 아무키나 입력하세요 >>")
    if(player_input == 'q') :
        print("\n이용해주셔서 감사합니다.")
        break
    else :
        insert_Pg = int(insert_Pg) + 1


# 아이디어 - 페이지 인덱스를 입력 , 그 페이지의 내용만 문장 선택 출력(nltk 패키지 이용)

# 항상 플레이어의 입력을 받을 수 있는 상태여야 함. -> 페이지 인덱스 입력
# q 이외의 입력은 다음 페이지 이동, q 입력 시 음성 재생 취소
