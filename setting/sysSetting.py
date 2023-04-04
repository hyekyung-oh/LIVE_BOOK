# volume값을 받아 음량 조정
def setVolume (Speak_Volume ,up_down_Signal) :
    # 음량 크기는 1 to 10 (실제로는 0.1 to 1)
    
    # 음량 증가 신호 및 볼륨이 10 이하일 떄 
    if up_down_Signal == "up" and Speak_Volume < 1:
        Speak_Volume = Speak_Volume + 0.1

        if Speak_Volume == 1 :
            print("최대 음량입니다.")
        
    # 음량 감소 신호 및 볼륨이 0 이상일때 
    if up_down_Signal == "down" and Speak_Volume > 0 :
        Speak_Volume = Speak_Volume - 0.1
        
        if Speak_Volume == 0 :
            print("음소거 상태입니다.")



# speed값을 받아 속도 조절
def setSpeed (speed) :
    Speak_speed = speed




# 페이지 넘버 지정
def setPage(page) :
    p