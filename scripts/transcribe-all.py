# scripts/transcribe_all.py
import whisper
import feedparser
import os
import json
import requests
from pathlib import Path
from datetime import datetime
import re

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

RSS_FEED_URL = os.getenv('RSS_FEED_URL')
TRANSCRIPTS_DIR = './transcripts'
TEMP_DIR = './temp'

def get_safe_filename(episode):
    """Create a safe filename from episode title and date"""
    title = episode.get('title', 'untitled')
    # Remove special characters
    safe = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:100]
    
    # Get date from pubDate
    pub_date = episode.get('published', 'no-date')
    try:
        date_str = datetime.strptime(pub_date, '%a, %d %b %Y %H:%M:%S %Z').strftime('%Y-%m-%d')
    except:
        date_str = 'no-date'
    
    return f"{date_str}-{safe}"

def download_audio(url, filepath):
    """Download audio file from URL"""
    print(f"  Downloading audio...")
    response = requests.get(url, stream=True)
    response.raise_for_status()
    
    with open(filepath, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    print(f"  ✓ Downloaded to {filepath}")

def transcribe_episode(audio_path, model):
    """Transcribe audio file using Whisper"""
    print(f"  Transcribing (this may take several minutes)...")
    result = model.transcribe(audio_path)
    return result['text']

def main():
    # Create directories
    Path(TRANSCRIPTS_DIR).mkdir(exist_ok=True)
    Path(TEMP_DIR).mkdir(exist_ok=True)
    
    print("Fetching episodes from RSS feed...")
    feed = feedparser.parse(RSS_FEED_URL)
    episodes = feed.entries
    print(f"Found {len(episodes)} episodes\n")
    
    # Get existing transcriptions
    existing = set(os.listdir(TRANSCRIPTS_DIR))
    print(f"Already have {len([f for f in existing if f.endswith('.txt')])} transcriptions\n")
    
    # Load Whisper model once
    print("Loading Whisper model (this may take a minute)...")
    model = whisper.load_model("base")
    print("✓ Model loaded\n")
    
    transcribed_count = 0
    skipped_count = 0
    failed_count = 0
    
    for i, episode in enumerate(episodes):
        title = episode.get('title', 'Untitled')
        filename = get_safe_filename(episode)
        txt_path = os.path.join(TRANSCRIPTS_DIR, f"{filename}.txt")
        json_path = os.path.join(TRANSCRIPTS_DIR, f"{filename}.json")
        
        # Check if already transcribed
        if os.path.exists(txt_path):
            print(f"[{i+1}/{len(episodes)}] ✓ Already have: {title}")
            skipped_count += 1
            continue
        
        print(f"\n[{i+1}/{len(episodes)}] Transcribing: {title}")
        
        try:
            # Get audio URL from enclosure
            audio_url = episode.enclosures[0].href if episode.enclosures else None
            if not audio_url:
                print(f"  ✗ No audio URL found")
                failed_count += 1
                continue
            
            print(f"  Audio URL: {audio_url}")
            
            # Download audio
            temp_audio = os.path.join(TEMP_DIR, 'episode.mp3')
            download_audio(audio_url, temp_audio)
            
            # Transcribe
            transcription = transcribe_episode(temp_audio, model)
            
            # Save transcription
            with open(txt_path, 'w', encoding='utf-8') as f:
                f.write(transcription)
            
            # Save metadata
            metadata = {
                'title': title,
                'pubDate': episode.get('published', ''),
                'audioUrl': audio_url,
                'transcribedAt': datetime.now().isoformat()
            }
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, indent=2)
            
            # Cleanup temp file
            os.remove(temp_audio)
            
            print(f"  ✓ Saved to {filename}.txt")
            print(f"  Preview: {transcription[:100]}...")
            transcribed_count += 1
            
        except Exception as e:
            print(f"  ✗ Failed: {str(e)}")
            failed_count += 1
            # Clean up temp file if it exists
            if os.path.exists(temp_audio):
                os.remove(temp_audio)
            continue
    
    print("\n=== Summary ===")
    print(f"Total episodes: {len(episodes)}")
    print(f"Already transcribed: {skipped_count}")
    print(f"Newly transcribed: {transcribed_count}")
    print(f"Failed: {failed_count}")

if __name__ == "__main__":
    main()