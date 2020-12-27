import json
import time
from requests import get, post
from config import FORM_RECOGNIZER_CONGIF
from utilities.utilities import remove_file, decrypt_pdf

apim_key = FORM_RECOGNIZER_CONGIF['API_KEY']
post_url = FORM_RECOGNIZER_CONGIF['ANALYZE_LAYOUT_ENDPOINT']


def init(filename, file_password, contentType='pdf', resultType="text"):
    """
    Initialize local form layout recognition process
    """
    textResult = ''
    error_message = None
    if (contentType == 'pdf'):
        error, pdfFilename = decrypt_pdf(filename, password=file_password)
        filename = pdfFilename
        error_message = error

    if(not error_message):
        x = 'application' if contentType == 'pdf' else 'image'
        headers = {
            # Request headers
            'Content-Type': f'{x}/{contentType}',
            'Ocp-Apim-Subscription-Key': apim_key,
        }

        with open(filename, "rb") as f:
            data_bytes = f.read()

        try:
            resp = post(url=post_url, data=data_bytes, headers=headers)
            if resp.status_code != 202:
                textResult = f"POST analyze failed:\n{resp.text}"

            get_url = resp.headers["operation-location"]
            textResult = get_layout_results(get_url, resultType)
            remove_file(filename)

        except Exception as e:
            textResult = f"POST analyze failed:\n{str(e)}"
    else:
        remove_file(filename)
        textResult = error_message

    return textResult


def parse_text(json_result):
    """
    Parse final result from json response
    """
    textResult = ''
    for result in json_result['analyzeResult']['readResults']:
        # textResult += f"***Page No. {result['page']}***\n"
        for line in result['lines']:
            textResult += line['text']
            textResult += '\n'
        textResult += '\n'

    return textResult


def get_layout_results(get_url, resultType="text"):
    """
    Fetch requested form's layout results by using authorized token
    """
    textResult = ''
    n_tries = 10
    n_try = 0
    wait_sec = 5
    stopProcess = False
    while (n_try < n_tries and not(stopProcess)):
        try:
            resp = get(url=get_url, headers={
                "Ocp-Apim-Subscription-Key": apim_key})
            resp_json = json.loads(resp.text)
            if resp.status_code != 200:
                textResult = f"GET Layout results failed:\n{resp_json}"
                stopProcess = True

            status = resp_json["status"]
            if status == "succeeded":
                if (resultType == "text"):
                    textResult = parse_text(resp_json)
                elif (resultType == "json"):
                    textResult = str(resp_json)
                stopProcess = True

            if status == "failed":
                textResult = f"Layout Analysis failed:\n{resp_json}"
                stopProcess = True

            # Analysis still running. Wait and retry.
            time.sleep(wait_sec)
            n_try += 1

        except Exception as e:
            textResult = f"GET analyze results failed:\n{str(e)}"
            stopProcess = True
    return textResult