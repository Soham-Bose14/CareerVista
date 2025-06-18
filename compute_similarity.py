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
import spacy

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
        filtered_words = [word for word in words if word not in stop_words]
        return ' '.join(filtered_words)
    except Exception as e:
        print(f"Error while processing the text: {e}")
        return ""

def extract_text_from_base64(file_b64):
    file_bytes = base64.b64decode(file_b64)
    try:
        text = extract_text_from_pdf(file_bytes)
        if not text.strip():
            raise ValueError("Empty PDF text")
        return text
    except Exception:
        try:
            text = extract_text_from_docx(file_bytes)
            if not text.strip():
                raise ValueError("Empty DOCX text")
            return text
        except Exception:
            return file_bytes.decode('utf-8', errors='ignore')
        
def extract_noun_phrases(doc):
    return " ".join(chunk.text.lower() for chunk in doc.noun_chunks)

def main():
    nlp = spacy.load("en_core_web_lg")
    data = json.load(sys.stdin)
    jd_b64 = data['jdBase64']
    resumes = data['resumes']

    # ✅ Extract job description text
    jd_raw_text = extract_text_from_base64(jd_b64)
    jd_text = clean_text(jd_raw_text)
    
    # New trial
    jd_text = nlp(jd_text)
    # jd_nouns = " ".join([token.lemma_ for token in jd_text if token.pos_ == "NOUN"])
    jd_nouns = extract_noun_phrases(jd_text)
    jd_nouns = nlp(jd_nouns)

    results = []

    for resume in resumes:
        resume_bytes = base64.b64decode(resume['resumeBase64'])
        try:
            resume_text = extract_text_from_pdf(resume_bytes)
            if not resume_text.strip():
                raise ValueError("Empty PDF")
        except Exception:
            try:
                resume_text = extract_text_from_docx(resume_bytes)
                if not resume_text.strip():
                    raise ValueError("Empty DOCX")
            except Exception:
                resume_text = resume_bytes.decode('utf-8', errors='ignore')

        resume_text = clean_text(resume_text)

        # word_vectorizer = TfidfVectorizer(max_features=750, stop_words='english')
        # combined_vectors = word_vectorizer.fit_transform([resume_text, jd_text])
        # score = cosine_similarity(combined_vectors[0], combined_vectors[1])[0][0]
        
        # New trial
        
        resume_text = nlp(resume_text)
        # resume_nouns = " ".join([token.lemma_ for token in resume_text if token.pos_ == "NOUN"])
        resume_nouns = extract_noun_phrases(resume_text)
        resume_nouns = nlp(resume_nouns)
        
        score = jd_nouns.similarity(resume_nouns)

        results.append({
            'id': resume['id'],
            'similarityScore': round(score * 100, 2),
        })

    print(json.dumps(results))

if __name__ == "__main__":
    main()
