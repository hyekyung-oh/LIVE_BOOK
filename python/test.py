# -*- coding: utf-8 -*-
import openai

openai.api_key = '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'

text = "그에게는 언제나 비누 냄새가 난다. 아니, 그렇지는 않다. 언제나라고는 할 수 없다. 그가 학교에서 돌아와 욕실로 뛰어가서 물을 뒤집어쓰고 나오는 때면 비누 냄새가 난다. 나는 책상 앞에 돌아앉아서 꼼짝도 하지 않고 있더라도 그가 가까이 오는 것을―그의 표정이나 기분까지라도 넉넉히 미리 알아차릴 수 있다. 티이샤쓰로 갈아입은 그는 성큼성큼 내 방으로 걸어 들어와 아무렇게나 안락의자에 주저앉든가, 창가에 팔꿈치를 집고 서면서 나에게 빙긋 웃어 보인다. ｢무얼 해?｣ 대개 이런 소리를 던진다. 그런 때에 그에게서 비누 냄새가 난다. 그리고 나는 나에게 가장 슬프고 괴로운 시간이 다가온 것을 깨닫는다. 엷은 비누의 향료와 함께 가슴속으로 저릿한 것이 퍼져 나간다―이런 말을 하고 싶었던 것이다."


# gpt 이용 분위기 추출함수
def extract_of_tense(text) :
    prompt = f"다음 문장에서 분위기를 긴장, 신남, 공포, 고요, 신비, 행복, 슬픔 중에서 한개만 골라줘. \n\n{text}"
    completions = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=200,
        n=1,
        stop=None,
        temperature=1,
    )
    message = completions.choices[0].text.strip()
    print(message)
    
    if "긴장" in message : 
        result = "긴장"
    elif "신남" in message :
        result = "신남"
    elif "공포" in message :
        result = "공포"
    elif "고요" in message :
        result = "고요"
    elif "신비" in message :
        result = "신비"
    elif "행복" in message :
        result = "행복"
    elif "슬픔" in message :
        result = "슬픔"
    else :
        result = "실패"
    
    return result
    


print(extract_of_tense(text))