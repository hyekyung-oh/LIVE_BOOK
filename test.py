# Import the required module
import pyttsx3
 
# Create a string
string = "Lorem Ipsum is simply dummy text " \
    + "of the printing and typesetting industry."
 
# Initialize the Pyttsx3 engine
engine = pyttsx3.init()
 
# We can use file extension as mp3 and wav, both will work
engine.save_to_file(string, 'speech')
 
# Wait until above command is not finished.
engine.runAndWait()