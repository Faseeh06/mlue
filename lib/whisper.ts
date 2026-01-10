import { apiKeyStorage } from './storage';

// Groq Whisper API configuration
const GROQ_WHISPER_API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const WHISPER_MODEL = 'whisper-large-v3'; // Groq supports whisper models

/**
 * Transcribe audio using Groq Whisper API
 * @param audioBlob - Audio file as Blob
 * @returns Transcribed text
 */
export async function transcribeAudioWithWhisper(audioBlob: Blob): Promise<string> {
  try {
    const apiKey = apiKeyStorage.getGroq();
    if (!apiKey) {
      throw new Error('API_KEY_MISSING');
    }

    console.log('Transcribing audio with Groq Whisper...');

    // Create FormData with audio file
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm'); // or audio.m4a, audio.wav, etc.
    formData.append('model', WHISPER_MODEL);
    formData.append('language', 'en'); // Optional: specify language

    const response = await fetch(GROQ_WHISPER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        // Don't set Content-Type, browser will set it with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq Whisper API error:', errorData);
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('API_KEY_MISSING');
      }
      throw new Error(`Whisper API request failed: ${response.status}`);
    }

    const data = await response.json();
    const transcribedText = data.text || '';
    console.log('Whisper transcription:', transcribedText);
    
    return transcribedText.trim();
  } catch (error) {
    console.error('Whisper transcription error:', error);
    
    if (error instanceof Error && error.message === 'API_KEY_MISSING') {
      throw error;
    }
    
    throw new Error('Failed to transcribe audio. Please try again.');
  }
}

/**
 * Check if Whisper API is available (requires Groq API key)
 */
export function isWhisperAvailable(): boolean {
  return apiKeyStorage.hasGroq();
}
