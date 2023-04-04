import fitz
import pyttsx3
import re
from setting import sysSetting as set

# 총 2074 pg 분량의 동화
PDF_FILE_PATH = "./pdfToText/data/kidsStorySample.pdf"

doc = fitz.open(PDF_FILE_PATH)

# tts 속성 변경
engine = pyttsx3.init()

# 기본 설정 값 지정
Speak_speed = 1
Speak_Volume = 0.5

# 말하는 속도
engine.setProperty("rate", 50)
rate = engine.getProperty("rate")

# 소리 크기
engine.setProperty("volume", 1)  # 0~1
volume = engine.getProperty("volume")

page = doc[7].get_text()  
text = re.sub(r'^\w', "", page)

# 페이지 넘버 슬라이싱
print(text[1:])
engine.say(text[1:])
    
engine.runAndWait()
engine.stop()