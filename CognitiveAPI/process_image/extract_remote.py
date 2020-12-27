import os
import requests
from config import COMPUTER_VISION_CONFIG

API_KEY = COMPUTER_VISION_CONFIG['API_KEY']
ENDPOINT = COMPUTER_VISION_CONFIG['OCR_ENDPOINT']


def init(image_url):
    text = ''
    results = get_text(image_url)
    print(results)
    text += parse_text(results)
    return text


def parse_text(results):
    """
    parse json into simple text
    """
    text = ''
    for region in results['regions']:
        for line in region['lines']:
            for word in line['words']:
                text += word['text'] + ' '
            text += '\n'
    return text


def get_text(image_url):
    """
    get response from server
    """
    print('Processing...')
    headers = {
        'Ocp-Apim-Subscription-Key': API_KEY
    }
    params = {
        'language': 'en',
        'detectOrientation ': 'true',
        'visualFeatures': 'Categories, Description, Color',
    }
    payload = {
        'url': image_url}
    response = requests.post(ENDPOINT, headers=headers,
                             params=params, json=payload)

    results = response.json()
    return results
