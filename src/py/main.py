import fitz
import pyttsx3
import re
from pydub import AudioSegment
 
# pip install PyMuPDF
# pip install pyttsx3

# 총 2074 pg 분량의 동화 모음집 
PDF_FILE_PATH = "../../data/kidsStorySample.pdf"

doc = fitz.open(PDF_FILE_PATH)

# tts 속성 변경
engine = pyttsx3.init()


# 기본 설정 값 지정
# Speak_speed = 50
# Speak_Volume = 1

# 말하는 속도 50 정도가 적당
engine.setProperty("rate", 50)
rate = engine.getProperty("rate")

# 소리 크기
engine.setProperty("volume", 1)  # 0~1
volume = engine.getProperty("volume")

# doc[i].get_text() 메소드로 원하는 페이지를 불러올 수 있음.

# text 에 각 페이지 씩 글이 저장됨. 
for i in range(5, doc.page_count) :
    page = doc[i]

    text = page.get_text()
    pgNum = text[:1]
    # 페이지 넘버 제거
    text = text[1:]

    # page의 내용의 공백과 숫자를 " "로 전처리
    text = re.sub(r'^\w', "", text)
    print(text)
    
    # tts 출력
    engine.say(text)
    # 페이지 별로 음성 저장 (이거 되야하는데 이상하게 안됨.. 확장자 .mp3만 안됨)
    engine.save_to_file(text, f'./data/mp3/{pgNum}')

    engine.runAndWait()
    
engine.stop()



