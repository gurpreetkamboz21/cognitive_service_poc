import os
from PyPDF2 import PdfFileReader, PdfFileWriter


def upload_file(request):
    file = request.files['file']
    file.save(file.filename)
    return file.filename

def upload_files(request):
    fileList = []
    for file in request.files.getlist('file'):
        filename = os.path.split(file.filename)[1]
        file.save(filename)
        fileList.append(filename)
    return fileList

def remove_file(file):
    os.remove(file)


def decrypt_pdf(input_path, password=None):
    error_message = None
    output_path = "out.pdf"
    pageCount = 10
    try:
        with open(input_path, 'rb') as input_file, \
                open(output_path, 'wb') as output_file:
            reader = PdfFileReader(input_file)
            if(password and not(password == "null")):
                reader.decrypt(password)

            writer = PdfFileWriter()
            if (reader.getNumPages()< pageCount):
                pageCount= reader.getNumPages()

            # for i in range(reader.getNumPages()):
            for i in range(pageCount):
                writer.addPage(reader.getPage(i))

            writer.write(output_file)
    except Exception as ex:
        input_file.close()
        output_file.close()
        if(str(ex).__contains__("File has not been decrypted")):
            error_message = "File is password protected. Please enter your password."
        else:
            error_message = str(ex)

    remove_file(input_path)
    return error_message, output_path


def getLanguageName(language_code):
    """
    Return full language name of given language-code
    """
    switcher = {
        "en": "English",
        "hi": "Hindi",
        "pa": "Punjabi"
    }
    return switcher.get(language_code, language_code)
