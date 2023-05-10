from flask import Flask, jsonify
from flask_cors import CORS
import fitz
import re
import pymysql
import kss # 한국어 문장 분리 패키지

# 서버를 여는 파일입니다 !!!!!!!!!!!!!!! 안 열면 작동안함 ! ********************************* #

# 총 2074 pg 분량의 동화 모음집 
PDF_FILE_PATH = "./data/신데렐라.pdf"

doc = fitz.open(PDF_FILE_PATH)

app = Flask(__name__)
#한글 깨짐 현상 해결
app.config['JSON_AS_ASCII'] = False

# CORS문제 해결
CORS(app)

# 페이지의 내용을 출력하는 함수
def print_text(insert_Pg) :
    print("------------------------------------")
    print("입력한 페이지는", insert_Pg, "page 입니다.")
    print("------------------------------------")
    insert_Pg = int(insert_Pg)
    page = doc[insert_Pg]
    text = page.get_text()

    #현재 페이지
    
    # 책 분량 변수
    max_Page = doc.page_count 
    
    # 페이지 넘버 제거
    text = text[1:]
    
    # page의 내용의 공백과 숫자를 " "로 전처리
    text = re.sub(r'^\w', "", text)
    text = re.sub(r'or Media, Inc.*', '', text, flags=re.DOTALL)
    
    data = {
        "name" : "name",
        "contents" : text[1:],
        "last_pg" : max_Page,
        "current_pg" : insert_Pg
    }

    return jsonify(data)

# 지정한 페잉지의 json 형식 출력
@app.route('/page/<int:id>')
def print_Page(id):
    return print_text(id)
    
    
# 지정한 페잉지의 json 형식 출력
@app.route('/')
def helloWorld():
    return 'Hello World'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

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