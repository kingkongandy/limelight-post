# 🚀 Quick Start - The Limelight Post

## You're All Set! Here's How to Test

### ✅ What's Already Done
1. ✅ Supabase connected
2. ✅ OpenAI API key securely stored
3. ✅ Backend Edge Functions deployed
4. ✅ Frontend configured
5. ✅ Ready to generate real AI stories!

---

## 🎬 Test It Now (3 Steps)

### **Step 1: Open the AI Agent Panel**
- Look for the **"AI Agent"** button in the top-right corner of your site
- Click it to open the control panel

### **Step 2: Generate Your First Story**
1. Select a vertical (e.g., "Arts & Music")
2. Choose "1" story to start (faster)
3. Optionally add a custom prompt like: "Focus on music festival news"
4. Click **"Generate Stories"**
5. Wait 5-10 seconds for GPT-4 to work its magic

### **Step 3: Review & Publish**
- Your AI-generated story will appear in the preview
- Click **"Publish Selected"** to add it to your site
- Boom! You've just published your first AI-written celebrity news story 🎉

---

## 🎯 What Happens Behind the Scenes

```
1. You click "Generate Stories"
   ↓
2. Frontend calls Supabase Edge Function
   ↓
3. Edge Function retrieves your OpenAI key (securely)
   ↓
4. Calls OpenAI GPT-4 with custom prompts
   ↓
5. GPT-4 generates headline, excerpt, full story, tags
   ↓
6. Returns to frontend (your API key never exposed!)
   ↓
7. You review and publish
```

**Security:** Your OpenAI API key is stored server-side and NEVER sent to the browser. Users can't see it, steal it, or abuse it.

---

## 💰 Cost Per Story

**GPT-4o-mini:** ~$0.0001-0.0003 per story (SUPER CHEAP!)
- Generating 10 stories = ~$0.003
- 100 stories = ~$0.03
- 1,000 stories/month = ~$0.30

**Current model:** We're using GPT-4o-mini - excellent quality at minimal cost!

---

## 🤖 Set Up Daily Automation (Optional)

Want fresh stories automatically published every day?

1. Open AI Agent panel
2. Click **"Configure Daily Publishing"**
3. Set time (e.g., 8:00 AM)
4. Choose stories per vertical (2-3 recommended)
5. Add custom prompts (optional)
6. Save schedule

**Example Schedule:**
- **8:00 AM daily:** Generate 2 stories per vertical (8 total stories)
- **Cost:** ~$0.002/day = ~$0.60/month (almost FREE!)
- **Result:** Fresh content every morning!

---

## 🔍 Example Custom Prompts

Get better results with specific prompts:

### **Arts & Music**
- "Focus on controversial album releases and feuds"
- "Cover emerging artists and viral TikTok musicians"
- "Highlight concert drama and backstage stories"

### **Fashion & Culture**
- "Focus on red carpet mishaps and designer drama"
- "Cover streetwear trends and influencer fashion"
- "Highlight Met Gala and fashion week controversies"

### **Sports & Leisure**
- "Focus on athlete scandals and contract disputes"
- "Cover esports tournaments and gaming influencers"
- "Highlight fitness trends and wellness influencers"

### **Business & News**
- "Focus on tech startup drama and founder feuds"
- "Cover creator economy and influencer business deals"
- "Highlight cryptocurrency and NFT news"

---

## 📊 Check Your OpenAI Usage

1. Visit: https://platform.openai.com/usage
2. See how many stories you've generated
3. Monitor your spending
4. Set spending limits to avoid surprises

**Recommended:** Set a monthly limit (e.g., $50) so you don't get unexpected bills.

---

## 🐛 Troubleshooting

### **Nothing happens when I click "Generate Stories"**
- Check browser console (F12) for errors
- Verify OpenAI API key is uploaded correctly
- Make sure you selected a vertical and count

### **"API key not configured" error**
- Your OpenAI key wasn't saved properly
- Re-run the secret creation process
- Verify key starts with `sk-`

### **"Rate limit exceeded" error**
- You've hit OpenAI's free tier limits
- Wait a few minutes and try again
- Upgrade your OpenAI plan for higher limits

### **Stories are low quality or repetitive**
- Add more specific custom prompts
- Increase temperature in backend code (currently 0.9)
- Make sure you're using GPT-4, not GPT-3.5

### **Generation takes forever**
- Normal: 5-10 seconds per story
- GPT-4 is slower but higher quality
- Generating 5 stories = 25-50 seconds total
- Switch to GPT-3.5 for faster results

---

## 🎨 Customize the AI Writer

### **Change Writing Tone**
Edit `/supabase/functions/server/index.tsx` (line 48):
```typescript
const systemPrompt = `You are an expert celebrity news writer...

Your writing style:
- More professional (vs. tabloid)
- Educational and informative
- Balanced reporting
```

### **Change Creativity Level**
Edit line 84:
```typescript
temperature: 0.7,  // More conservative
// vs.
temperature: 1.0,  // Maximum creativity
```

### **Switch to Cheaper Model**
Edit line 83:
```typescript
model: 'gpt-3.5-turbo',  // ~$0.002/story
// vs.
model: 'gpt-4-turbo-preview',  // ~$0.03/story
```

---

## 📈 Next Level Features

### **Add Real News Scraping**
Instead of AI imagination, scrape real celebrity news:
- NewsAPI.org (100 free/day)
- RSS feeds (TMZ, People, Billboard)
- Social media APIs (Twitter, Reddit)

Then use AI to rewrite in your style!

### **Add Image Generation**
- DALL-E 3 for custom celebrity images
- Stable Diffusion for unlimited free images
- Midjourney API for high-quality visuals

### **Add Content Scheduling**
- Queue stories for specific publish times
- Auto-publish throughout the day
- Social media auto-posting

### **Add Analytics**
- Track which verticals perform best
- A/B test different headline styles
- Monitor reader engagement

---

## ✅ Production Checklist

Before going fully live:

- [ ] Test generating 1 story (works?)
- [ ] Test generating 5 stories (all good quality?)
- [ ] Review AI-generated content (factually sound?)
- [ ] Set OpenAI spending limit ($50/month recommended)
- [ ] Test daily automation (schedule for tomorrow)
- [ ] Check Supabase Edge Function logs (any errors?)
- [ ] Verify no API keys in browser console
- [ ] Test on mobile (responsive?)
- [ ] Add your own branding/logo
- [ ] Connect your own domain

---

## 🎉 You're Ready to Launch!

Your celebrity news site is powered by:
- ✅ **Real AI** (GPT-4 Turbo)
- ✅ **Secure backend** (Supabase Edge Functions)
- ✅ **Modern design** (Lime green tabloid style)
- ✅ **Automated publishing** (Daily story generation)

**Estimated value of this setup:** $2,000+ if built from scratch
**Your actual cost:** ~$9-$90/month (depending on usage)

---

## 💡 Pro Tips

1. **Start with 1-2 stories/day** to control costs
2. **Review before publishing** - AI is good but not perfect
3. **Use specific prompts** for better quality
4. **Monitor costs daily** for the first week
5. **A/B test different styles** to find what works
6. **Engage your audience** - add comments, social sharing
7. **Iterate and improve** based on reader feedback

---

## 🆘 Need Help?

- **Integration Guide:** See `/INTEGRATION_GUIDE.md` for details
- **OpenAI Docs:** https://platform.openai.com/docs
- **Supabase Docs:** https://supabase.com/docs/guides/functions

---

**Ready to generate your first story?** Click that AI Agent button! 🚀