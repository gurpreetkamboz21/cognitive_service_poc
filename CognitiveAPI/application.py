from flask import Flask, jsonify, request
from flask_cors import CORS
from utilities.utilities import upload_file, remove_file, upload_files
from process_image import extract_local as ocrLocal, extract_remote as ocrRemote, recognize_text_local, recognize_text_remote, batch_analyze_local, batch_analyze_remote #tesseract_local, tesseract_remote
from process_audio import extract_local as audio
from process_forms import extract_local as recognizeLocalFile, extract_remote as recognizeRemoteFile
from process_text import translate
from process_forms import extract_with_custom_model as customModelFile
import json
import os;

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


def json_response(data, user_message, success=True):
    """
    Custom response object
    """
    return jsonify({
        "data": data,
        "userMessage": user_message,
        "success": success
    })


@app.route('/api/image/ocr', methods=['POST'])
def image_ocr_remote():
    """
    Use OCR API service to process remote image for text extraction
    """
    rawReq = request.json
    try:
        return json_response(ocrRemote.init(rawReq['image']), "processed successfully")
    except Exception as ex:
        return json_response(None, str(ex), False)


@app.route('/api/image/ocr/local', methods=['POST'])
def image_ocr_local():
    """
    Use OCR API service to process local image for text extraction
    """
    try:
        filename = upload_file(request)
        return json_response(ocrLocal.init(filename), "processed successfully")
    except Exception as ex:
        remove_file(filename)
        return json_response(None, str(ex), False)


@app.route('/api/image/recognize', methods=['POST'])
def image_recognize():
    """
    Use recognize API service to process remote image for text extraction
    """
    rawReq = request.json
    try:
        return json_response(recognize_text_remote.init(rawReq['image'], rawReq['recognizeMode']), "processed successfully")
    except Exception as ex:
        return json_response(None, str(ex), False)


@app.route('/api/image/recognize/local', methods=['POST'])
def image_recognize_local():
    """
    Use recognize API service to process local image for text extraction
    """
    try:
        filename = upload_file(request)
        return json_response(recognize_text_local.init(filename, request.form['recognizeMode']), "processed successfully")
    except Exception as ex:
        remove_file(filename)
        return json_response(None, str(ex), False)


@app.route('/api/image/batchAnalyze', methods=['POST'])
def image_batch_analyze():
    """
    Use Batch Analyze API service to process remote image for text extraction
    """
    rawReq = request.json
    try:
        return json_response(batch_analyze_remote.init(rawReq['image']), "processed successfully")
    except Exception as ex:
        return json_response(None, str(ex), False)


@app.route('/api/image/batchAnalyze/local', methods=['POST'])
def image_batch_analyze_local():
    """
    Use Batch Analyze API service to process local image for text extraction
    """
    try:
        filename = upload_file(request)
        return json_response(batch_analyze_local.init(filename), "processed successfully")
    except Exception as ex:
        remove_file(filename)
        return json_response(None, str(ex), False)


@app.route('/api/audio/recognize', methods=['POST'])
def audio_recognize():
    """
    Use speech API to extract text from an audio file
    """
    try:
        filename = upload_file(request)
        return jsonify(audio.init(filename))
    except Exception as ex:
        remove_file(filename)
        return jsonify(str(ex))


@app.route('/api/form/analyze/local', methods=['POST'])
def form_analyze_local():
    """
    Use Layout Analyze API to extract text from a file (pdf/ png/ jpeg/ tiff)
    """
    try:
        filename = upload_file(request)
        return jsonify(recognizeLocalFile.init(filename, request.form['filePassword'], request.form['fileType'], request.form['resultType']))
    except Exception as ex:
        remove_file(filename)
        return jsonify(str(ex))


@app.route('/api/form/analyze', methods=['POST'])
def form_analyze():
    """
    Use Layout Analyze API to extract text from a remote file (pdf/ png/ jpeg/ tiff)
    """
    rawReq = request.json
    try:
        return jsonify(recognizeRemoteFile.init(rawReq['file'], rawReq['resultType']))
    except Exception as ex:
        return jsonify(str(ex))

@app.route('/api/text/translate', methods=['POST'])
def translate_text():
    data = request.json
    text_input = data['text']
    translation_output = data['language']
    try:
        response = translate.get_translation(text_input, translation_output)
        return json_response(response, "Translated Successfully")
    except Exception as ex:
        return json_response(None, str(ex), False)


@app.route('/', methods=['GET'])
def api_start():
    return "API running..."

@app.route('/api/form/custommodel/local', methods=['POST'])
def form_custom_model_local():
    """
    Use Layout Analyze API to extract text from a file (pdf/ png/ jpeg/ tiff)
    """
    try:
        
        responseList = []
        filenames = upload_files(request)
        for filename in filenames:
            extension = (os.path.splitext(filename)[1]).split('.')[1]
           
            if (extension == 'jpg'):
                extension = 'jpeg'
           
            response = customModelFile.init(filename, request.form['filePassword'], request.form['modelid'], extension, request.form['resultType'])
            responseList.append(response)
            
        return jsonify(responseList)
    except Exception as ex:
        return jsonify(str(ex))

app.run(debug=True)