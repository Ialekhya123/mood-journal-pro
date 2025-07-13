const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// Available mood options for AI to choose from
const AVAILABLE_MOODS = [
  'happy', 'sad', 'angry', 'anxious', 'neutral', 'excited', 'calm', 'frustrated', 'grateful', 'overwhelmed'
];

export async function detectMoodFromNotes(notes, customMoods = []) {
  if (!notes || notes.trim().length < 10) {
    return null; // Need at least 10 characters for meaningful analysis
  }

  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not found. AI mood detection disabled.');
    return null;
  }

  try {
    const allMoods = [...AVAILABLE_MOODS, ...customMoods];
    const moodList = allMoods.join(', ');
    
    const prompt = `Analyze the following journal entry and determine the most appropriate mood. 
    
Available moods: ${moodList}

Journal entry: "${notes}"

Instructions:
1. Consider the emotional tone, language, and context
2. Choose the most accurate mood from the available options
3. If none of the preset moods match well, choose the closest one
4. Respond with ONLY the mood word, nothing else

Mood:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that analyzes text to determine emotional mood. Respond with only the mood word.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 10,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const suggestedMood = data.choices[0].message.content.trim().toLowerCase();
    
    // Validate that the suggested mood is in our available options
    if (allMoods.includes(suggestedMood)) {
      return suggestedMood;
    } else {
      // If AI suggests something not in our list, find the closest match
      return findClosestMood(suggestedMood, allMoods);
    }

  } catch (error) {
    console.error('AI mood detection error:', error);
    return null;
  }
}

function findClosestMood(suggestedMood, availableMoods) {
  // Simple similarity matching - you could implement more sophisticated matching
  const moodSynonyms = {
    'joyful': 'happy',
    'cheerful': 'happy',
    'content': 'happy',
    'depressed': 'sad',
    'melancholy': 'sad',
    'upset': 'sad',
    'furious': 'angry',
    'irritated': 'angry',
    'worried': 'anxious',
    'nervous': 'anxious',
    'stressed': 'anxious',
    'peaceful': 'calm',
    'relaxed': 'calm',
    'thankful': 'grateful',
    'appreciative': 'grateful',
    'busy': 'overwhelmed'
  };

  // Check for exact synonyms first
  if (moodSynonyms[suggestedMood]) {
    return moodSynonyms[suggestedMood];
  }

  // Default to neutral if no good match found
  return 'neutral';
}

export function isAIMoodDetectionAvailable() {
  return !!OPENAI_API_KEY;
} 