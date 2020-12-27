import os
import requests
from config import COMPUTER_VISION_CONFIG

API_KEY = COMPUTER_VISION_CONFIG['API_KEY']
ENDPOINT = COMPUTER_VISION_CONFIG['RECOGNIZE_ENDPOINT']


def init(image_path, recognizeMode):
    text = ''
    results = get_text(image_path, recognizeMode)
    text += parse_text(results)
    return text


def parse_text(results):
    """
    parse json into simple text
    """
    text = ''
    for line in results['recognitionResult']['lines']:
        for word in line['words']:
            text += word['text'] + ' '
    return text


def get_text(image_url, recognizeMode):
    """
    get response from server
    """
    print('Processing...')
    headers = {
        'Ocp-Apim-Subscription-Key': API_KEY
    }
    params = {
        'mode': 'Handwritten' if recognizeMode == 'h' else 'Printed'
        #   'mode': 'Handwritten'
        #   'mode': 'Printed'
    }
    payload = {
        'url': image_url}
    response = requests.post(ENDPOINT, headers=headers,
                             params=params, json=payload)
    operation_url = response.headers["Operation-Location"]

    operation_response = requests.get(operation_url, headers=headers)
    results = operation_response.json()
    return results
