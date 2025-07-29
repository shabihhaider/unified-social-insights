import openai
import json
import os
from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def build_prompt(username, platform, metadata):
    metrics = json.dumps(metadata, indent=2)
    return f"""
You are an expert social media strategist. Analyze the following 7-day data for {platform} account "{username}":

{metrics}

1. Has engagement increased or decreased?
2. What types of posts performed best?
3. Are there any patterns in posting time or format?
4. Recommend improvements or experiments.
Respond with a friendly and insightful 3-5 sentence summary.
"""

def generate_summary(prompt):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{ "role": "user", "content": prompt }],
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print("❌ OpenAI API error:", str(e))
        return "AI summary generation failed."
