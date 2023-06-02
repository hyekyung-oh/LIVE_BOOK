import os
import sys
import json
import urllib.request

client_id = "DPMDn08wE2vSMkryJrrn"  # 개발자센터에서 발급받은 Client ID 값
client_secret = "9JFWE3tOTf"  # 개발자센터에서 발급받은 Client Secret 값

encText = urllib.parse.quote("Ashiver induced by the stone wall ran through Helena. Her heart kicked into the next gear when she noted the restraints around her wrists. She struggled, tugging at the unforgiving shackles time and time again.“Looks like she’s finally awake,” someone said in a gruff voice.“Then get on with it,” another replied.She whipped her head around in search of the voices. The sudden actionblurred her vision, causing her to squint. A low-wattage bulb at the end of the room exposed crates and stacked boxes. A bald man sat at a table; his legs crossed at the heel whilst his beefy hands held the local newspaper.The second man pushed away from the grimy wall, sauntering towards her. His unnerving grin revealed a set of elongated canines.A breath caught in her throat.“Aren’t you a tad bit young to be working for Alexander?” he asked.A deep frown creased her face while her attention darted between hercaptors. She didn’t work for Alexander nor did she ever want to see him or Lucious again.The stranger stopped a foot away from her. Dark, greasy hair clung to his scalp in thinning streaks. A few strands separated at the front, curtaining his heavy-lidded eyes. He reached out, grabbing her hair with a sharp twist and lifted her head to meet his narrowed eyes. “I asked you a question, human.”Her nose wrinkled in disgust. His breath—a mixture of cheap tobacco, beer, and something else—caused her stomach to churn. Panic will not solve anything, she thought, yet her heart ignored her rationalisation.“I don’t work for him,” she said, surprised her voice came out unshaken.He waved at her thin shirt and smart trousers. “We saw you leaving his club looking like this.”Helena fought the urge to roll her eyes. If he’d been inside, he would know Alexander’s staff didn’t wear uniforms. Well, the bouncers did... “This is what anyone would wear to an interview!”His eyes flared with a light-grey glow, and she instantly regretted her snappy tone. She flinched under his menacing stare which made her think of a glowering two-year-old she used to babysit. The kid always shot daggers her way if she didn’t give him any candy.“...you listening?” He let go of her hair with a sudden shove as he shouted at her.")
data = "source=en&target=ko&text=" + encText  # source와 target 언어를 영어(en)에서 한국어(ko)로 변경
url = "https://openapi.naver.com/v1/papago/n2mt"
request = urllib.request.Request(url)
request.add_header("X-Naver-Client-Id", client_id)
request.add_header("X-Naver-Client-Secret", client_secret)
response = urllib.request.urlopen(request, data=data.encode("utf-8"))
rescode = response.getcode()

if rescode == 200:
    response_body = response.read()
    result = json.loads(response_body.decode('utf-8'))
    translated_text = result['message']['result']['translatedText']
    print(translated_text)
else:
    print("Error Code:" + str(rescode))
