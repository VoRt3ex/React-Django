







1. Install tesseract using windows installer available at: https://github.com/UB-Mannheim/tesseract/wiki

2. Note the tesseract path from the installation.

3. pip install pytesseract

4. Set the tesseract path in the script before calling image_to_string:

after importing pyresseract add in manin_processors.py
pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
