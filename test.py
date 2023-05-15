import pymysql

# db 연결 설정
db = pymysql.connect(host='selab.hknu.ac.kr',
                     port=51714,
                     user='pbl3_team3',
                     passwd='12345678',
                     db='2023_1_pbl3',
                     charset='utf8')

# 커서 생성
cursor = db.cursor()

# SQL 쿼리 실행
sql_query = "SELECT MAX(team3_id) FROM team3_Imgs_Pages;"
cursor.execute(sql_query)

# 결과 가져오기
team3_BooksID = cursor.fetchone()[0]

# db 연결 종료
db.close()

# 마지막으로 삽입된 레코드의 ID 값 출력
print(f"The last inserted team3_BooksID is {team3_BooksID}.")
