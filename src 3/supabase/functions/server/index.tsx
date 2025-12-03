import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

// Tavily API integration for real news search
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Helper function to search the web for real news
async function searchRealNews(query: string, vertical: string): Promise<{ context: string; sources: Array<{ title: string; url: string }> }> {
  const tavilyApiKey = Deno.env.get('TAVILY_API_KEY');
  
  if (!tavilyApiKey) {
    console.log('⚠️ TAVILY_API_KEY not configured - AI will generate fictional content');
    return { context: '', sources: [] };
  }
  
  try {
    console.log(`🔍 Searching real news for: "${query}" in ${vertical}`);
    
    // Add vertical-specific context to search query
    const verticalContext: Record<string, string> = {
      'arts-music': 'music artist entertainment news',
      'fashion-culture': 'fashion designer style news',
      'sports-leisure': 'sports athlete fitness news',
      'business-news': 'tech business startup entrepreneur news',
    };
    
    // CRITICAL: Force recent news with time-based keywords
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const searchQuery = `${query} ${verticalContext[vertical] || ''} latest breaking news December 2025`;
    
    console.log(`📅 Searching with date context: ${currentDate}`);
    
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: tavilyApiKey,
        query: searchQuery,
        search_depth: 'advanced',
        include_answer: true,
        include_raw_content: false,
        max_results: 5,
        days: 3, // 🔥 CRITICAL: Only show news from last 3 days
        include_domains: [],
        exclude_domains: [],
      }),
    });
    
    if (!response.ok) {
      console.error(`Tavily API error: ${response.status}`);
      return { context: '', sources: [] };
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Extract sources with URLs for citations
      const sources = data.results.map((result: any) => ({
        title: result.title,
        url: result.url,
      }));
      
      // Format search results into context for AI with DATES EMPHASIZED
      const newsContext = data.results
        .map((result: any, index: number) => {
          return `[Source ${index + 1}] ${result.title}\n${result.content}\nURL: ${result.url}\nDate: RECENT (within last 3 days)\n`;
        })
        .join('\n---\n');
      
      console.log(`✅ Found ${data.results.length} RECENT news articles (last 3 days)`);
      console.log(`Search context preview: ${newsContext.substring(0, 200)}...`);
      
      return { context: newsContext, sources };
    }
    
    console.log('⚠️ No recent search results found - try broader search terms');
    return { context: '', sources: [] };
  } catch (error) {
    console.error(`Error searching news: ${error}`);
    return { context: '', sources: [] };
  }
}

// Helper function to fetch real images from Getty Images
async function fetchGettyImage(query: string): Promise<string | null> {
  const apiKey = Deno.env.get('GETTY_API_KEY');
  
  if (!apiKey) {
    console.log('Getty API key not configured, skipping Getty search');
    return null;
  }
  
  try {
    console.log(`🎬 Fetching Getty image for: "${query}"`);
    
    const response = await fetch(
      `https://api.gettyimages.com/v3/search/images?phrase=${encodeURIComponent(query)}&fields=id,title,thumb,preview&sort_order=most_popular&page_size=1`,
      {
        headers: {
          'Api-Key': apiKey,
        },
      }
    );
    
    if (!response.ok) {
      console.error(`Getty API error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.images && data.images.length > 0) {
      // Getty returns preview URLs - use the display_sizes for best quality
      const image = data.images[0];
      const imageUrl = image.display_sizes?.[0]?.uri || image.preview?.uri;
      
      if (imageUrl) {
        console.log(`✅ Found Getty image: ${imageUrl}`);
        return imageUrl;
      }
    }
    
    console.log(`⚠️ No Getty results for "${query}"`);
    return null;
  } catch (error) {
    console.error(`Error fetching Getty image: ${error}`);
    return null;
  }
}

// Helper function to fetch real images from Unsplash
async function fetchUnsplashImage(query: string): Promise<string> {
  const accessKey = Deno.env.get('UNSPLASH_ACCESS_KEY');
  
  if (!accessKey) {
    console.warn('UNSPLASH_ACCESS_KEY not found, using fallback image');
    return `https://picsum.photos/seed/${query.replace(/\s+/g, '-')}/1200/800`;
  }
  
  try {
    console.log(`🔍 Fetching Unsplash image for: "${query}"`);
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
      }
    );
    
    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status}`);
      return `https://picsum.photos/seed/${query.replace(/\s+/g, '-')}/1200/800`;
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular; // High quality image
      console.log(`✅ Found Unsplash image: ${imageUrl}`);
      return imageUrl;
    } else {
      console.log(`⚠️ No Unsplash results for "${query}", using fallback`);
      return `https://picsum.photos/seed/${query.replace(/\s+/g, '-')}/1200/800`;
    }
  } catch (error) {
    console.error(`Error fetching Unsplash image: ${error}`);
    return `https://picsum.photos/seed/${query.replace(/\s+/g, '-')}/1200/800`;
  }
}

// Master function: Try Getty first, fallback to Unsplash, then Picsum
async function fetchStoryImage(query: string): Promise<string> {
  // Try Getty Images first (premium celebrity photos)
  const gettyUrl = await fetchGettyImage(query);
  if (gettyUrl) return gettyUrl;
  
  // Fallback to Unsplash (free stock photos)
  return await fetchUnsplashImage(query);
}

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-d2c193b9/health", (c) => {
  return c.json({ status: "ok" });
});

// AI Story Generation endpoint
app.post("/make-server-d2c193b9/generate-stories", async (c) => {
  try {
    const body = await c.req.json();
    const { vertical, count, customPrompt, useMockMode } = body;
    
    console.log(`=== GENERATION REQUEST ===`);
    console.log(`Vertical: ${vertical}`);
    console.log(`Count: ${count}`);
    console.log(`Custom Prompt: ${customPrompt || 'none'}`);
    console.log(`Mock Mode: ${useMockMode}`);
    console.log(`Mock Mode (boolean): ${Boolean(useMockMode)}`);
    console.log(`Full body:`, JSON.stringify(body));
    
    // MOCK MODE - for testing without OpenAI credits
    // Check explicitly for boolean true (handle both boolean and string just in case)
    const isMockMode = useMockMode === true || useMockMode === 'true' || useMockMode === 1;
    console.log(`Is Mock Mode?: ${isMockMode}`);
    
    if (isMockMode) {
      console.log('✅ USING MOCK MODE - generating fake stories');
      const mockStories = [];
      
      // Vertical-specific data for smarter mock generation
      const verticalData: Record<string, any> = {
        'arts-music': {
          celebrities: [
            'Rising Pop Star Zara Moon', 'Chart-Topping Producer DJ Nexus', 'Grammy Winner Aria Stone',
            'Viral Rapper Koi Wave', 'Indie Artist Phoenix Ray', 'K-Pop Sensation Luna Park'
          ],
          actions: [
            'Drops Surprise Album', 'Announces World Tour', 'Breaks Streaming Records',
            'Collaborates with', 'Wins Major Award', 'Goes Viral on TikTok', 'Headlines Festival'
          ],
          topics: [
            'new album release', 'sold-out concert', 'music video premiere', 'chart-topping single',
            'award show performance', 'studio collaboration', 'live performance'
          ],
          tags: ['Music', 'Entertainment', 'Trending', 'Arts'],
          imageQuery: 'music concert performance'
        },
        'fashion-culture': {
          celebrities: [
            'Fashion Icon Stella Laurent', 'Supermodel Jade Chen', 'Designer Maven Rocco Voss',
            'Style Influencer Mia Rose', 'Runway Star Nico Banks', 'Trendsetter Quinn Lee'
          ],
          actions: [
            'Debuts New Collection', 'Stuns at Fashion Week', 'Launches Sustainable Line',
            'Breaks Fashion Rules', 'Sets New Trend', 'Partners with Luxury Brand', 'Redesigns Red Carpet'
          ],
          topics: [
            'fashion week debut', 'designer collaboration', 'sustainable fashion', 'style revolution',
            'runway moment', 'brand partnership', 'cultural impact'
          ],
          tags: ['Fashion', 'Style', 'Culture', 'Trending'],
          imageQuery: 'fashion runway model'
        },
        'sports-leisure': {
          celebrities: [
            'Olympic Champion Marcus Ford', 'Pro Athlete Jenna Storm', 'E-Sports Legend Cyber Nova',
            'Fitness Icon Tyler Cross', 'Tennis Star Aria Williams', 'Basketball Phenom Jay Rivers'
          ],
          actions: [
            'Breaks World Record', 'Wins Championship', 'Signs Historic Deal',
            'Dominates Tournament', 'Achieves Career Milestone', 'Launches Fitness Brand', 'Makes Comeback'
          ],
          topics: [
            'championship victory', 'record-breaking performance', 'major tournament', 'training innovation',
            'sports technology', 'athlete wellness', 'competitive gaming'
          ],
          tags: ['Sports', 'Athletics', 'Competition', 'Fitness'],
          imageQuery: 'sports athlete action'
        },
        'business-news': {
          celebrities: [
            'Tech Mogul Jordan Park', 'Entrepreneur Sophia Blake', 'Startup Founder Alex Rivera',
            'Investor Maven Dana Sterling', 'Creator Economy Pioneer Casey Lin', 'Business Titan Morgan Hayes'
          ],
          actions: [
            'Raises $100M Funding', 'Disrupts Industry', 'Launches Revolutionary App',
            'Acquires Competitor', 'Goes Public', 'Unveils Innovation', 'Announces Partnership'
          ],
          topics: [
            'startup funding', 'tech innovation', 'market disruption', 'creator platform',
            'business strategy', 'venture capital', 'digital economy'
          ],
          tags: ['Business', 'Tech', 'Innovation', 'Startups'],
          imageQuery: 'business technology innovation'
        }
      };
      
      const data = verticalData[vertical] || verticalData['business-news'];
      
      // Extract keywords from custom prompt for more targeted stories
      const promptKeywords = customPrompt ? customPrompt.toLowerCase() : '';
      
      for (let i = 0; i < count; i++) {
        // If custom prompt exists, try to extract a celebrity/person name from it
        // Otherwise use random celebrity from our list
        let celebrity = data.celebrities[Math.floor(Math.random() * data.celebrities.length)];
        
        if (customPrompt) {
          // Use the custom prompt as the celebrity name if it looks like a name
          // (contains capitalized words that aren't common words)
          const capitalizedWords = customPrompt.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
          if (capitalizedWords && capitalizedWords.length > 0) {
            // Use the first capitalized phrase as the celebrity name
            celebrity = capitalizedWords[0];
          } else {
            // If no clear name, use the custom prompt directly as part of the story
            celebrity = customPrompt;
          }
        }
        
        const action = data.actions[Math.floor(Math.random() * data.actions.length)];
        const topic = data.topics[Math.floor(Math.random() * data.topics.length)];
        
        // Adjust tone/angle based on custom prompt keywords
        let angle = '';
        if (promptKeywords.includes('controversy') || promptKeywords.includes('scandal')) {
          angle = ' Amid Controversy';
        } else if (promptKeywords.includes('positive') || promptKeywords.includes('inspiring')) {
          angle = ' in Inspiring Move';
        } else if (promptKeywords.includes('gen z') || promptKeywords.includes('young')) {
          angle = ' as Gen Z Icon';
        } else if (promptKeywords.includes('breaking') || promptKeywords.includes('urgent')) {
          angle = ' - Breaking News';
        }
        
        const title = `${celebrity} ${action}${angle}`;
        
        // Generate contextual excerpt based on vertical
        const excerptTemplates: Record<string, string[]> = {
          'arts-music': [
            `The music world is buzzing as ${celebrity} makes waves with ${topic} that's already trending across social media.`,
            `Fans can't stop talking about ${celebrity}'s latest move in the ${topic} space, calling it a game-changer.`
          ],
          'fashion-culture': [
            `Fashion insiders are calling ${celebrity}'s ${topic} the most talked-about moment of the season.`,
            `${celebrity} continues to redefine style with a bold ${topic} that has everyone watching.`
          ],
          'sports-leisure': [
            `${celebrity} proves once again why they're at the top with an incredible ${topic} performance.`,
            `The athletic world is celebrating as ${celebrity} achieves a stunning ${topic} milestone.`
          ],
          'business-news': [
            `Tech and business circles are abuzz as ${celebrity} makes bold moves in the ${topic} sector.`,
            `${celebrity}'s latest ${topic} announcement signals major shifts in the industry landscape.`
          ]
        };
        
        const excerptOptions = excerptTemplates[vertical] || excerptTemplates['business-news'];
        const excerpt = excerptOptions[Math.floor(Math.random() * excerptOptions.length)];
        
        // Generate more detailed, vertical-specific content
        const contentIntro = customPrompt 
          ? `${celebrity} has made headlines with a move that directly addresses ${customPrompt.toLowerCase()}. `
          : `${celebrity} has captured attention with developments in ${topic}. `;
        
        const content = `${contentIntro}Industry insiders are calling this a watershed moment that could reshape the landscape.

The announcement comes at a crucial time when the industry is experiencing rapid evolution. "${action} is exactly what we need right now," says entertainment analyst Jordan Mitchell. "This shows real vision and understanding of where things are heading."

Sources close to ${celebrity} reveal this has been carefully planned for months, with a dedicated team working behind the scenes. Early reactions across social media have been overwhelmingly positive, with fans and industry professionals alike praising the bold approach.

What makes this particularly significant is the timing and execution. As one industry expert notes, "This isn't just another ${topic} - this is ${celebrity} setting a new standard for excellence."

As the story continues to develop, all eyes will be on ${celebrity} to see what comes next. With this momentum, the possibilities seem endless.`;
        
        // Add custom prompt keywords to tags if present
        const customTags = customPrompt 
          ? [customPrompt.split(' ').slice(0, 2).join(' ')]
          : [];
        
        mockStories.push({
          id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title,
          excerpt,
          content,
          vertical,
          author: 'Mock Writer',
          date: new Date().toISOString().split('T')[0],
          imageUrl: await fetchStoryImage(celebrity),
          tags: [...data.tags, ...customTags, 'Breaking News'].slice(0, 5),
          aiGenerated: true,
          source: 'ai', // Mark as AI-generated for cleanup rules
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`Successfully generated ${mockStories.length} mock stories for ${vertical}`);
      return c.json(mockStories);
    }
    
    // REAL AI MODE - requires OpenAI credits
    console.log('⚠️ USING REAL AI MODE - calling OpenAI API');
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error('OPENAI_API_KEY not found in environment');
      return c.json({ error: 'API key not configured' }, 500);
    }

    // Search for real news about the topic
    const searchQuery = customPrompt || '';
    const realNewsData = await searchRealNews(searchQuery, vertical);

    // Vertical prompts mapping - matches mock mode structure
    const verticalPrompts: Record<string, string> = {
      'arts-music': 'Focus on music artists, concerts, album releases, entertainment industry news, and cultural events.',
      'fashion-culture': 'Focus on fashion trends, designer news, celebrity style, runway events, and cultural movements.',
      'sports-leisure': 'Focus on athletes, sports events, fitness trends, esports, and leisure activities.',
      'business-news': 'Focus on startups, tech entrepreneurs, creator economy, business ventures, and industry innovations.',
    };

    const systemPrompt = `You are a professional journalist for "The Limelight Post" covering celebrity and influencer news.

WRITING STYLE - HYBRID TABLOID/JOURNALIST (CRITICAL):
- Headlines: Punchy, dramatic, attention-grabbing (tabloid energy)
- Content: Factual, sourced, credible (journalistic integrity)
- Lead with the most shocking/interesting fact first
- Use power words: "Stuns", "Reveals", "Breaks Silence", "Shocks Fans"
- Include proper citations for credibility ("according to...", "sources confirm...")
- Mix tabloid excitement with hard facts and real quotes
- Write like TMZ/Daily Mail BUT with real sources and dates
- Third-person perspective throughout

${realNewsData.context ? `
SOURCING REQUIREMENTS (MANDATORY):
- Every major claim MUST cite a source
- Use inline citations like: "according to ESPN" or "Billboard confirms"
- Extract and use REAL QUOTES from the provided sources
- Include specific details: dates, locations, numbers, names
- DO NOT fabricate information - only use facts from the provided sources
- TODAY'S DATE: December 2, 2025 - mention if this is breaking/recent
- Stories MUST be from the last 3 days (Nov 29 - Dec 2, 2025)

SOURCES PROVIDED (LAST 3 DAYS ONLY):
${realNewsData.context}
` : `
- Generate realistic celebrity/influencer news stories
- Create plausible quotes and scenarios
`}

Write stories that are BOTH exciting AND credible.`;

    const userPrompt = `Write a celebrity/influencer news story for "${vertical}".

Focus: ${verticalPrompts[vertical] || ''}

${customPrompt ? `SUBJECT: "${customPrompt}"
Build the story around ${customPrompt} as the main subject.

` : ''}

${realNewsData.context ? `
⚠️ CRITICAL INSTRUCTIONS:
1. Base this story ENTIRELY on the RECENT sources provided above (last 3 days)
2. Lead with the most dramatic/shocking angle from the sources
3. Cite sources inline (e.g., "according to ESPN", "Billboard reports", etc.)
4. Use REAL quotes from the sources (in quotation marks with attribution)
5. Include specific dates (Nov 29 - Dec 2, 2025), locations, and numbers
6. Maintain factual accuracy - do not embellish or fabricate
7. TODAY IS DECEMBER 2, 2025 - make it feel CURRENT and BREAKING
8. Reject any sources older than 3 days - only use FRESH news
` : ''}

Return ONLY valid JSON (no markdown, no extra text):
{
  "title": "Punchy tabloid-style headline${customPrompt ? ` about ${customPrompt}` : ''} with power words (70 characters max)",
  "excerpt": "2-sentence dramatic lead with the most shocking fact first",
  "content": "4-6 paragraphs mixing tabloid energy with journalistic sourcing${realNewsData.context ? ' - cite sources inline' : ''}. Use paragraph breaks (\\\\n\\\\n). Include direct quotes with attribution. Lead with drama, support with facts.",
  "tags": [${customPrompt ? `"${customPrompt}", ` : ''}"Tag1", "Tag2", "Tag3", "Breaking News"],
  "imageQuery": "${customPrompt ? customPrompt + ' ' : ''}2-3 keywords for image search"${realNewsData.sources.length > 0 ? `,\\n  "sources": ${JSON.stringify(realNewsData.sources)}` : ''}
}`;

    const stories = [];

    // Generate stories one at a time
    for (let i = 0; i < count; i++) {
      console.log(`Generating story ${i + 1}/${count}...`);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7, // Lower temperature for more factual, consistent output
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('OpenAI API error:', error);
        throw new Error(`OpenAI API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      if (!content) {
        throw new Error('No content generated from OpenAI');
      }

      const storyData = JSON.parse(content);
      
      const storyId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Use custom prompt for image search, or extract first part of title as fallback
      const imageSearchQuery = customPrompt || storyData.title.split(' ').slice(0, 3).join(' ');
      
      stories.push({
        id: storyId,
        title: storyData.title,
        excerpt: storyData.excerpt,
        content: storyData.content,
        vertical,
        author: 'AI Writer',
        date: new Date().toISOString().split('T')[0],
        imageUrl: await fetchStoryImage(imageSearchQuery),
        tags: storyData.tags,
        aiGenerated: true,
        source: 'ai', // Mark as AI-generated for cleanup rules
        sources: storyData.sources || realNewsData.sources || [], // Include sources for citations
      });

      // Small delay between requests to avoid rate limiting
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`Successfully generated ${stories.length} stories`);
    return c.json(stories);
    
  } catch (error) {
    console.error('Story generation error:', error);
    return c.json({ 
      error: 'Failed to generate stories', 
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Generate daily stories for all verticals
app.post("/make-server-d2c193b9/generate-daily-stories", async (c) => {
  try {
    const { verticalPrompts, storiesPerVertical } = await c.req.json();
    
    console.log(`Generating daily stories: ${storiesPerVertical} per vertical`);
    
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error('OPENAI_API_KEY not found in environment');
      return c.json({ error: 'API key not configured' }, 500);
    }

    const verticals = ['arts-music', 'fashion-culture', 'sports-leisure', 'business-news'];
    const allStories = [];

    for (const vertical of verticals) {
      const customPrompt = verticalPrompts[vertical] || '';
      
      console.log(`Generating stories for ${vertical}...`);
      
      for (let i = 0; i < storiesPerVertical; i++) {
        // Search for real news about the topic
        const realNewsData = await searchRealNews(customPrompt, vertical);
        
        const systemPrompt = `You are a professional journalist for "The Limelight Post" covering celebrity and influencer news.

WRITING STYLE - HYBRID TABLOID/JOURNALIST (CRITICAL):
- Headlines: Punchy, dramatic, attention-grabbing (tabloid energy)
- Content: Factual, sourced, credible (journalistic integrity)
- Lead with the most shocking/interesting fact first
- Use power words: "Stuns", "Reveals", "Breaks Silence", "Shocks Fans"
- Include proper citations for credibility ("according to...", "sources confirm...")
- Mix tabloid excitement with hard facts and real quotes
- Write like TMZ/Daily Mail BUT with real sources and dates
- Third-person perspective throughout

${realNewsData.context ? `
SOURCING REQUIREMENTS (MANDATORY):
- Every major claim MUST cite a source
- Use inline citations like: "according to ESPN" or "Billboard confirms"
- Extract and use REAL QUOTES from the provided sources
- Include specific details: dates, locations, numbers, names
- DO NOT fabricate information - only use facts from the provided sources
- TODAY'S DATE: December 2, 2025 - mention if this is breaking/recent
- Stories MUST be from the last 3 days (Nov 29 - Dec 2, 2025)

SOURCES PROVIDED (LAST 3 DAYS ONLY):
${realNewsData.context}
` : `
- Generate realistic celebrity/influencer news stories
- Create plausible quotes and scenarios
`}

Write stories that are BOTH exciting AND credible.`;

        const defaultPrompts: Record<string, string> = {
          'arts-music': 'Music artists, concerts, album releases, entertainment industry news, and cultural events.',
          'fashion-culture': 'Fashion trends, designer news, celebrity style, runway events, and cultural movements.',
          'sports-leisure': 'Athletes, sports events, fitness trends, esports, and leisure activities.',
          'business-news': 'Startups, tech entrepreneurs, creator economy, business ventures, and industry innovations.',
        };

        const userPrompt = `Write a celebrity/influencer news story for "${vertical}".

Focus: ${defaultPrompts[vertical]}
${customPrompt ? `SUBJECT: "${customPrompt}"
Build the story around ${customPrompt} as the main subject.

` : ''}

${realNewsData.context ? `
⚠️ CRITICAL INSTRUCTIONS:
1. Base this story ENTIRELY on the RECENT sources provided above (last 3 days)
2. Lead with the most dramatic/shocking angle from the sources
3. Cite sources inline (e.g., "according to ESPN", "Billboard reports", etc.)
4. Use REAL quotes from the sources (in quotation marks with attribution)
5. Include specific dates (Nov 29 - Dec 2, 2025), locations, and numbers
6. Maintain factual accuracy - do not embellish or fabricate
7. TODAY IS DECEMBER 2, 2025 - make it feel CURRENT and BREAKING
8. Reject any sources older than 3 days - only use FRESH news
` : ''}

Return ONLY valid JSON (no markdown, no extra text):
{
  "title": "Punchy tabloid-style headline${customPrompt ? ` about ${customPrompt}` : ''} with power words (70 characters max)",
  "excerpt": "2-sentence dramatic lead with the most shocking fact first",
  "content": "4-6 paragraphs mixing tabloid energy with journalistic sourcing${realNewsData.context ? ' - cite sources inline' : ''}. Use paragraph breaks (\\\\n\\\\n). Include direct quotes with attribution. Lead with drama, support with facts.",
  "tags": [${customPrompt ? `"${customPrompt}", ` : ''}"Tag1", "Tag2", "Tag3", "Breaking News"],
  "imageQuery": "${customPrompt ? customPrompt + ' ' : ''}2-3 keywords for image search"${realNewsData.sources.length > 0 ? `,\\n  "sources": ${JSON.stringify(realNewsData.sources)}` : ''}
}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7, // Lower temperature for more factual, consistent output
            response_format: { type: 'json_object' },
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('OpenAI API error:', error);
          continue; // Skip this story but continue with others
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        if (content) {
          const storyData = JSON.parse(content);
          
          const storyId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          // Use custom prompt for image search, or extract first part of title as fallback
          const imageSearchQuery = customPrompt || storyData.title.split(' ').slice(0, 3).join(' ');
          
          allStories.push({
            id: storyId,
            title: storyData.title,
            excerpt: storyData.excerpt,
            content: storyData.content,
            vertical,
            author: 'AI Writer',
            date: new Date().toISOString().split('T')[0],
            imageUrl: await fetchStoryImage(imageSearchQuery),
            tags: storyData.tags,
            aiGenerated: true,
            sources: storyData.sources || realNewsData.sources || [], // Include sources for citations
          });
        }

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Successfully generated ${allStories.length} daily stories`);
    return c.json(allStories);
    
  } catch (error) {
    console.error('Daily story generation error:', error);
    return c.json({ 
      error: 'Failed to generate daily stories', 
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Get scheduling settings
app.get("/make-server-d2c193b9/schedule-settings", async (c) => {
  try {
    const settings = await kv.get('schedule-settings');
    return c.json(settings || {
      enabled: false,
      time: '06:00', // 6am PST
      storiesPerVertical: 3,
      lastRun: null
    });
  } catch (error) {
    console.error('Error fetching schedule settings:', error);
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

// Update scheduling settings
app.post("/make-server-d2c193b9/schedule-settings", async (c) => {
  try {
    const settings = await c.req.json();
    await kv.set('schedule-settings', settings);
    console.log('Schedule settings updated:', settings);
    return c.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating schedule settings:', error);
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

// Save manual story
app.post("/make-server-d2c193b9/save-manual-story", async (c) => {
  try {
    const story = await c.req.json();
    
    // Validate required fields
    if (!story.title || !story.excerpt || !story.content || !story.vertical) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Generate story ID and add metadata
    const storyId = `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const completeStory = {
      ...story,
      id: storyId,
      author: story.author || 'Editor',
      date: new Date().toISOString().split('T')[0],
      aiGenerated: false,
      source: 'manual', // Mark as manually written
      keepIndefinitely: story.keepIndefinitely || false, // Option to keep forever
      // If no image URL provided, fetch one based on title
      imageUrl: story.imageUrl || await fetchStoryImage(story.title.split(' ').slice(0, 3).join(' ')),
    };
    
    console.log('Saved manual story:', completeStory.title);
    return c.json(completeStory);
  } catch (error) {
    console.error('Error saving manual story:', error);
    return c.json({ 
      error: 'Failed to save manual story', 
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Admin signup endpoint
app.post("/make-server-d2c193b9/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }
    
    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || 'Admin' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    console.log('✅ Created admin user:', email);
    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return c.json({ 
      error: 'Failed to create admin account', 
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// AI Polish & Rewrite endpoint - rewrites manual stories in brand voice
app.post("/make-server-d2c193b9/ai-polish", async (c) => {
  try {
    const { content, title, vertical } = await c.req.json();
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500);
    }
    
    console.log(`✨ AI Polishing story: "${title}"`);
    
    const systemPrompt = `You are a professional editor for The Limelight Post, a modern tabloid covering influencers and celebrities.

YOUR VOICE:
- Hybrid tabloid/journalist style
- Punchy, engaging headlines and intros
- Factual content with dramatic flair
- Professional but entertaining
- Perfect grammar and spelling

REWRITE THE FOLLOWING STORY:
1. Keep all facts and information intact
2. Fix any spelling/grammar errors
3. Add tabloid energy to the writing
4. Make it more engaging and readable
5. Keep the same general structure
6. Add excitement without fabricating details

Return ONLY the polished content, no explanations.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Title: ${title}\n\nContent:\n${content}` }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const polishedContent = data.choices[0].message.content;
    
    console.log('✅ Story polished successfully');
    return c.json({ polishedContent });
  } catch (error) {
    console.error('Error polishing story:', error);
    return c.json({ 
      error: 'Failed to polish story', 
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

Deno.serve(app.fetch);