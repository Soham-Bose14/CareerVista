import sys
import json
import base64
from io import BytesIO
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import re

nltk.download(['stopwords', 'punkt'], quiet=True)

from pdfminer.high_level import extract_text as extract_pdf_text
import docx 

def extract_text_from_pdf(pdf_bytes):
    with BytesIO(pdf_bytes) as f:
        return extract_pdf_text(f)
    
def extract_text_from_docx(docx_bytes):
    with BytesIO(docx_bytes) as f:
        doc = docx.Document(f)
        full_text = []
        
        for para in doc.paragraphs:
            full_text.append(para.text)
        return '\n'.join(full_text)
    
def clean_text(text):
    if not isinstance(text, str):
        return ""
    
    try:
        text = text.lower()
        text = re.sub(r'\[.*?\]', '', text)
        text = re.sub(r'\b\d+[\.\d]*\b', '', text)
        text = re.sub(r'^\w\s', ' ', text)
        
        words = word_tokenize(text)
        
        stop_words = set(stopwords.words('english'))
        
        filtered_words = []
        
        for word in words:
            if word not in stop_words:
                filtered_words.append(word)
        
        return ' '.join(filtered_words)
    except Exception as e:
        print(f"Error while processing the text: {e}")
    
def main():
    data = json.load(sys.stdin)
    jd_text = data['jdText']
    resumes = data['resumes']
    
    results = []
        
    for resume in resumes:
        resume_bytes = base64.b64decode(resume['resumeBase64'])
        try:
            resume_text = extract_text_from_pdf(resume_bytes)
            if not resume_text.strip():
                raise ValueError("Empty pdf text")
            
        except Exception:
            try:
                resume_text = extract_text_from_docx(resume_bytes)
                if not resume_text.strip():
                    raise ValueError("Empty DOCX text")
            except Exception:
                resume_text = resume_bytes.decode('utf-8', errors='ignore')
        
        resume_text = clean_text(resume_text)
        jd_text = clean_text(jd_text)
        
        word_vectorizer = TfidfVectorizer(max_features=750, stop_words='english')
    
        combined_vectors = word_vectorizer.fit_transform([resume_text, jd_text])
        score = cosine_similarity(combined_vectors[0], combined_vectors[1])[0][0]
        
        results.append({
            'id': resume['id'],
            'similarityScore': round(score * 100, 2),
        })
        
        # similarity_scores.append(score)
        
    print(json.dumps(results))
    
if __name__ == "__main__":
    main()