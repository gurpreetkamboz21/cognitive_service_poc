import json
import requests
from utilities.utilities import remove_file
from config import SPEECH_CONFIG

API_KEY = SPEECH_CONFIG['API_KEY']
REGION = 'eastus'
MODE = 'conversation'
LANG = 'en-US'
FORMAT = 'simple'


def init(filename):
    # 1. Get an Authorization Token
    token = get_token()
    # 2. Perform Speech Recognition
    results = get_text(token, filename)
    remove_file(filename)
    # 3. Return Result
    return results['DisplayText']


def get_token():
    # Return an Authorization Token by making a HTTP POST request to Cognitive Services with a valid API key.
    url = SPEECH_CONFIG['ENDPOINT']
    headers = {
        'Ocp-Apim-Subscription-Key': API_KEY
    }
    r = requests.post(url, headers=headers)
    token = r.content
    return(token)


def get_text(token, audio):
    # Request that the Bing Speech API convert the audio to text
    url = f'https://{REGION}.stt.speech.microsoft.com/speech/recognition/{MODE}/cognitiveservices/v1?language={LANG}&format={FORMAT}'
    headers = {
        'Accept': 'application/json',
        'Ocp-Apim-Subscription-Key': API_KEY,
        'Transfer-Encoding': 'chunked',
        'Content-type': 'audio/wav; codec=audio/pcm; samplerate=44100',
        'Authorization': f'Bearer {token}'
    }
    r = requests.post(url, headers=headers, data=stream_audio_file(audio))
    results = json.loads(r.content)
    return results


def stream_audio_file(speech_file, chunk_size=1024):
    # Chunk audio file
    with open(speech_file, 'rb') as f:
        while 1:
            data = f.read(1024)
            if not data:
                break
            yield data
