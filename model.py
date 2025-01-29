from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from googletrans import Translator
from langdetect import detect
import urllib.parse
import torch
from re import sub
from transformers import T5Tokenizer, T5ForConditionalGeneration

# FastAPI setup
app = FastAPI()

# Initialize the Google Translator
translator = Translator()

# Load pre-trained T5 model and tokenizer
model_name = "t5-base"  # You can use "t5-large" for better performance
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

# Use GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
model.eval()

# Abbreviations dictionary
ABBREVIATIONS = {
    'AI': 'Artificial Intelligence',
    'DevOps': 'Development Operations',
    'QA': 'Quality Assurance',
    'HR': 'Human Resources',
    'UX': 'User Experience',
    'UI': 'User Interface',
    'PM': 'Project Manager',
    'DBA': 'Database Administrator',
    'BA': 'Business Analyst',
    'CIO': 'Chief Information Officer',
    'CTO': 'Chief Technology Officer',
    'SRE': 'Site Reliability Engineer',
    'ML': 'Machine Learning',
    'NLP': 'Natural Language Processing',
    'SEO': 'Search Engine Optimization',
    'SEM': 'Search Engine Marketing',
    'RPA': 'Robotic Process Automation',
    'BI': 'Business Intelligence'
}

# API input model
class JobSearchRequest(BaseModel):
    job_title: str
    location: Optional[str] = ''


@app.post("/api/search-jobs")
async def search_jobs(job_search: JobSearchRequest):
    try:
        # Step 1: Expand abbreviations if present (original title)
        expanded_job_title = expand_abbreviation(job_search.job_title, model, tokenizer, device)

        # Step 2: Translate the original job title
        translated_job_title = detect_and_translate(job_search.job_title)

        # Also translate the expanded job title
        if expanded_job_title != job_search.job_title:
            translated_expanded_job_title = detect_and_translate(expanded_job_title)
        else:
            translated_expanded_job_title = translated_job_title

        # Step 3: Scrape job boards with both the original and expanded job titles
        jobs = []

        # Scraping Wuzzuf
        jobs += scrape_wuzzuf(expanded_job_title, job_search.location)

        # Scraping Tanqeeb
        jobs += scrape_tanqeeb(expanded_job_title, job_search.location)

        # Step 4: Filter out duplicates
        jobs_df = pd.DataFrame(jobs)
        jobs_df.drop_duplicates(subset='URL', inplace=True)

        # Convert DataFrame to JSON
        jobs_json = jobs_df.to_dict(orient='records')

        return {"job_results": jobs_json}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Function to detect language and translate text
def detect_and_translate(text):
    # Detect language of the input text
    detected_language = detect(text)

    # If the detected language is Arabic, translate it to English, otherwise, translate to Arabic
    if detected_language == 'ar':
        # Translate Arabic text to English
        translated_text = translator.translate(text, src='ar', dest='en').text
    else:
        # Translate English text to Arabic
        translated_text = translator.translate(text, src='en', dest='ar').text

    print(f"Original Text: {text}")
    print(f"Translated text: {translated_text}")

    return translated_text


# Function to expand abbreviations using T5 model
def expand_abbreviation(job_title, model, tokenizer, device):
    # First, use the abbreviation dictionary
    words = job_title.split()
    expanded_words = [ABBREVIATIONS.get(word.upper(), word) for word in words]
    expanded_text = ' '.join(expanded_words)

    # Check if any abbreviation was expanded
    if expanded_text != job_title:
        print(f"Expanded Text using dictionary: {expanded_text}")
        return expanded_text

    # If no abbreviation was found in the dictionary, fallback to T5 model
    input_text = f"Expand the abbreviation in the following job title: {job_title}"
    inputs = tokenizer.encode(input_text, return_tensors="pt").to(device)

    with torch.no_grad():
        outputs = model.generate(
            inputs,
            max_length=50,
            num_beams=5,
            early_stopping=True
        )

    expanded_title = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(f"Expanded Title using T5: {expanded_title}")
    return expanded_title


# Function to scrape jobs from Tanqeeb
def scrape_tanqeeb(job_title, location=''):
    print("Scraping Tanqeeb...")
    jobs = []
    base_url = f"https://www.tanqeeb.com/jobs/search?keywords={urllib.parse.quote_plus(job_title)}&country=-1&state=0&search_period=0&order_by=most_recent&search_in=f&lang=all"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(base_url, headers=headers)

    if response.status_code != 200:
        print(f"Failed to retrieve Tanqeeb page. Status code: {response.status_code}")
        return jobs

    soup = BeautifulSoup(response.text, 'html.parser')
    job_cards = soup.find_all('div', class_='card-body')

    if not job_cards:
        print("No job cards found. Check the page structure or the class names.")
        return jobs

    print(f"Found {len(job_cards)} job cards.")

    for card in job_cards:
        # Extract the job title
        title_tag = card.find('h2')

        # Extract all spans with the specified class
        span_tags = card.find_all('span', class_='pr-2 pb-1 d-block d-lg-inline-block')

        # Initialize variables
        company_tag = location_tag = date_tag = None

        # Assign spans based on their order or identifiable content
        if span_tags:
            if len(span_tags) >= 1:
                company_tag = span_tags[0]  # Assuming the first span is the company
            if len(span_tags) >= 2:
                location_tag = span_tags[1]  # Assuming the second span is the location
            if len(span_tags) >= 3:
                date_tag = span_tags[2]  # Assuming the third span is the date

        # Extract the job description
        description_tag = card.find('div', class_='mb-4 text-primary-2 h7')

        # Extract the job URL
        href = card.find('a', href=True)  # Assuming the link is within an <a> tag

        if href:
            if href['href'].startswith('http'):
                url = href['href']
            else:
                url = 'https://www.tanqeeb.com' + href['href']
        else:
            url = None

        # Create a job dictionary
        job = {
            'Title': title_tag.text.strip() if title_tag else None,
            'Company': company_tag.text.strip() if company_tag else None,
            'Location': location_tag.text.strip() if location_tag else None,
            'Date': date_tag.text.strip() if date_tag else None,
            'Description': description_tag.text.strip() if description_tag else None,
            'URL': url
        }

        jobs.append(job)

    return jobs


# Function to scrape jobs from Wuzzuf
def scrape_wuzzuf(job_title, location=''):
    print("Scraping Wuzzuf...")
    jobs = []
    base_url = "https://wuzzuf.net/search/jobs/"
    params = {'a': 'navbl', 'q': job_title, 'l': location}
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(base_url, params=params, headers=headers)
    if response.status_code != 200:
        print(f"Failed to retrieve Wuzzuf page. Status code: {response.status_code}")
        return jobs

    soup = BeautifulSoup(response.text, 'html.parser')
    job_cards = soup.find_all('div', class_='css-1gatmva e1v1l3u10')
    for card in job_cards:
        title_tag = card.find('h2', class_='css-m604qf')
        company_tag = card.find('a', class_='css-17s97q8')
        location_tag = card.find('span', class_='css-5wys0k')
        date_tag = card.find('div', class_='css-4c4ojb') or card.find('div', class_='css-do6t5g')
        description_tag = card.find('div')
        url_tag = title_tag.find('a') if title_tag else None
        href = url_tag.get('href') if url_tag else None

        if href:
            if href.startswith('http'):
                url = href
            else:
                url = 'https://wuzzuf.net' + href
        else:
            url = None

        job = {
            'Title': title_tag.text.strip() if title_tag else None,
            'Company': company_tag.text.strip() if company_tag else None,
            'Location': location_tag.text.strip() if location_tag else None,
            'Date': date_tag.text.strip() if date_tag else None,
            'Description': description_tag.text.strip() if description_tag else None,
            'URL': url
        }
        jobs.append(job)
    print(f"Found {len(jobs)} jobs on Wuzzuf.")
    return jobs


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://bkogwuvtbaesprkejqjt.supabase.co", "http://localhost:5173"],  # You can replace '*' with your Supabase domain if you want to restrict access
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods like GET, POST, etc.
    allow_headers=["*"],  # Allow all headers
)
