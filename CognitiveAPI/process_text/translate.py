from config import TRANSLATOR_CONFIG
import os
import requests
import uuid
import json
from utilities.utilities import getLanguageName

API_KEY = TRANSLATOR_CONFIG['API_KEY']
ENDPOINT = TRANSLATOR_CONFIG['TRANSLATE_ENDPOINT']
REGION = TRANSLATOR_CONFIG["REGION"]


def parse_response(res):
    detected_language = ''
    translated_text = ''
    for data in res:
        detected_language = data['detectedLanguage']['language']
        for translation in data['translations']:
            translated_text = translation['text']
    return {
        "detectedLanguage": getLanguageName(detected_language),
        "translatedText": translated_text
    }


def get_translation(text_input, language_output):
    params = '&to=' + language_output
    constructed_url = ENDPOINT + params
    print(constructed_url)

    headers = {
        'Ocp-Apim-Subscription-Key': API_KEY,
        'Ocp-Apim-Subscription-Region': REGION,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    # You can pass more than one object in body.
    body = [{
        'text': text_input
    }]

    try:
        response = requests.post(constructed_url, headers=headers, json=body)
        return parse_response(response.json())
    except Exception as ex:
        raise ex
