import type { Story, Vertical } from '../types';
import { projectId, publicAnonKey } from './supabase/info.tsx';

/**
 * REAL AI STORY GENERATOR - PRODUCTION READY
 * 
 * This implementation uses Supabase Edge Functions to securely call OpenAI.
 * Your API key is stored server-side and never exposed to users.
 * 
 * Architecture:
 * Frontend -> Supabase Edge Function -> OpenAI API -> Response
 */

const SUPABASE_FUNCTION_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d2c193b9`;

// Main export functions
export async function generateStories(
  vertical: Vertical, 
  count: number, 
  customPrompt?: string,
  useMockMode?: boolean
): Promise<Story[]> {
  try {
    console.log(`=== FRONTEND: Calling backend ===`);
    console.log(`Vertical: ${vertical}`);
    console.log(`Count: ${count}`);
    console.log(`Custom Prompt: ${customPrompt || 'none'}`);
    console.log(`Mock Mode: ${useMockMode}`);
    console.log(`Mock Mode (boolean): ${Boolean(useMockMode)}`);
    
    const requestBody = {
      vertical,
      count,
      customPrompt,
      useMockMode: Boolean(useMockMode), // Explicitly convert to boolean
    };
    
    console.log(`Request body:`, JSON.stringify(requestBody));
    
    const response = await fetch(`${SUPABASE_FUNCTION_URL}/generate-stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Backend error:', errorData);
      throw new Error(`Failed to generate stories: ${errorData.error || response.statusText}`);
    }

    const stories = await response.json();
    console.log(`Successfully generated ${stories.length} stories`);
    return stories;
    
  } catch (error) {
    console.error('Story generation error:', error);
    throw error;
  }
}

export async function generateDailyStories(
  verticalPrompts: Record<Vertical, string>,
  storiesPerVertical: number
): Promise<Story[]> {
  try {
    console.log(`Calling backend to generate daily stories...`);
    
    const response = await fetch(`${SUPABASE_FUNCTION_URL}/generate-daily-stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        verticalPrompts,
        storiesPerVertical,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Backend error:', errorData);
      throw new Error(`Failed to generate daily stories: ${errorData.error || response.statusText}`);
    }

    const stories = await response.json();
    console.log(`Successfully generated ${stories.length} daily stories`);
    return stories;
    
  } catch (error) {
    console.error('Daily story generation error:', error);
    throw error;
  }
}