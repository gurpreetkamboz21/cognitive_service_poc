import os
import requests
from utilities.utilities import remove_file
from config import COMPUTER_VISION_CONFIG

API_KEY = COMPUTER_VISION_CONFIG['API_KEY']
ENDPOINT = COMPUTER_VISION_CONFIG['BATCH_ANALYZE_ENDPOINT']


def init(image_path):
    text = ''
    results = get_text(image_path)
    text += parse_text(results)
    remove_file(image_path)
    return text


def parse_text(results):
    """
    parse json into simple text
    """
    text = ''
    for recognitionResult in results['recognitionResults']:
        for line in recognitionResult['lines']:
            text += line['text'] + ' '
            text += '\n'
    return text


def get_text(pathToImage):
    """
    get response from server
    """
    print('Processing...')
    headers = {
        'Ocp-Apim-Subscription-Key': API_KEY,
        'Content-Type': 'application/octet-stream'
    }
    payload = open(pathToImage, 'rb').read()
    response = requests.post(ENDPOINT, headers=headers, data=payload)
    operation_url = response.headers["Operation-Location"]

    operation_response = requests.get(operation_url, headers=headers)
    results = operation_response.json()
    return results
