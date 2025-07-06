import requests
from django.conf import settings

HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base"

HEADERS = {
    "Authorization": f"Bearer {settings.HF_API_KEY}"
}

def get_ai_task_suggestions(title, description, context=None):
    prompt = f"""
You are a smart productivity assistant. Analyze the task below and return:
1. Task priority (scale 1-10)
2. Suggested deadline (in YYYY-MM-DD)
3. Enhanced task description
4. Suggested category

Task Title: {title}
Description: {description}
Context: {context or 'None'}

Respond in this format:
Priority: <number>
Deadline: <date>
Description: <new description>
Category: <category name>
"""

    response = requests.post(
        HF_API_URL,
        headers=HEADERS,
        json={"inputs": prompt}
    )

    if response.status_code != 200:
        raise Exception(f"HuggingFace error: {response.text}")

    raw = response.json()
    return raw[0]['generated_text']