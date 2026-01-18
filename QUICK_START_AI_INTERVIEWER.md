# 🎤 AI Voice Interviewer - Quick Start

## What's New?

The AI Voice Interviewer has been added to **Student Interview Practice** section! Students can now practice real-time voice interviews with an AI.

## Access the Feature

Visit: `http://localhost:5000/student/interview-practice`

You'll see two options:
1. **🎤 AI Voice Interview (NEW!)** - Real-time voice conversation
2. **Interview Setup (Text Mode)** - Traditional text-based interview practice

## Getting Started (3 Steps)

### Step 1: Get Vapi Token
1. Visit https://vapi.ai
2. Sign up (free tier available)
3. Get your web token from dashboard

### Step 2: Add to .env
Update `.env` file:
```env
VITE_VAPI_WEB_TOKEN=your_token_here
```

### Step 3: Start Using!
1. Go to `/student/interview-practice`
2. Click "Start Interview Call"
3. Allow microphone access
4. Start talking!

## Features

✨ **Real-time voice conversations**
✨ **Automatic transcription**
✨ **AI responds naturally**
✨ **Full transcript saved**
✨ **Works without Vapi token** (shows setup guide)

## No Vapi Token Yet?

Don't worry! The component shows a helpful guide when Vapi token is missing. Just follow the setup steps and it will start working immediately.

## Files Added/Modified

✅ Added: `client/src/components/AIInterviewer.tsx`
✅ Added: `client/src/lib/vapi.ts`
✅ Added: `client/src/lib/vapi-config.ts`
✅ Modified: `client/src/pages/student/InterviewPractice.tsx`
✅ Modified: `.env`

## Component Details

The AIInterviewer component can be used anywhere:

```tsx
<AIInterviewer
  userName="Student Name"
  userId="user-123"
  questions={["Your questions here"]}
  onFinish={(transcript) => handleTranscript(transcript)}
/>
```

## Testing Without Token

The component works great even without Vapi token configured - it shows a helpful configuration prompt. Perfect for development!

## Default Interview Questions

If no questions provided, uses these defaults:
- Tell me about yourself and your background
- What are your key strengths?
- Describe a challenging project you've worked on
- Why are you interested in this position?
- What is your ideal work environment?

## Supported Browsers

✅ Chrome/Chromium
✅ Firefox  
✅ Safari
✅ Edge

All modern browsers with WebRTC support.

## Microphone Tips

- Check browser permissions
- Test microphone in Chrome Settings
- Speak clearly and naturally
- Allow 2-3 seconds between responses
- Use a quiet environment for best results

---

**Ready to practice?** Go to `/student/interview-practice` and click "Start Interview Call"! 🚀
