import os
import requests
from utilities.utilities import remove_file
from config import COMPUTER_VISION_CONFIG

API_KEY = COMPUTER_VISION_CONFIG['API_KEY']
ENDPOINT = COMPUTER_VISION_CONFIG['OCR_ENDPOINT']


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
    for region in results['regions']:
        for line in region['lines']:
            for word in line['words']:
                text += word['text'] + ' '
            text += '\n'
    return text


def get_text(pathToImage):
    """
    get response from server
    """
    print('Processing: ' + pathToImage)
    headers = {
        'Ocp-Apim-Subscription-Key': API_KEY,
        'Content-Type': 'application/octet-stream'
    }
    params = {
        'language': 'en',
        'detectOrientation ': 'true',
        'visualFeatures': 'Categories, Description, Color',
    }
    payload = open(pathToImage, 'rb').read()
    response = requests.post(ENDPOINT, headers=headers,
                             params=params, data=payload)

    results = response.json()
    return results
