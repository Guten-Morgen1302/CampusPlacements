# AI Voice Interviewer Setup Guide

The AI Voice Interviewer feature has been successfully integrated into the CampusPlacements platform! This allows students to practice real-time voice interviews with an AI interviewer powered by Vapi.ai.

## Features

✅ **Real-time Voice Conversations** - Natural voice-based interviews with AI
✅ **Live Transcription** - See your responses as you speak
✅ **Smart Interviewer** - AI asks follow-up questions based on your responses
✅ **Interview Modes** - Technical, Behavioral, HR, and Custom questions
✅ **Response Recording** - All responses are transcribed and saved
✅ **Non-blocking** - Component works gracefully even without Vapi token (shows helpful configuration message)

## How It Works

The AI Interviewer is integrated at: `http://localhost:5000/student/interview-practice`

### Features:
- **Voice Call Interface** - Click "Start Interview Call" to begin
- **Real-time Transcription** - See both your responses and AI responses
- **Flexible Question Sets** - Choose from pre-defined questions or use custom ones
- **Transcript Display** - View the full conversation history

## Setup Instructions

### 1. Get a Vapi.ai Account

1. Go to [https://vapi.ai](https://vapi.ai)
2. Sign up for a free account
3. Get your API token from the dashboard

### 2. Configure Environment Variables

Add these to your `.env` file:

```env
VITE_VAPI_WEB_TOKEN=your_actual_vapi_token_here
VITE_VAPI_WORKFLOW_ID=your_vapi_workflow_id_here
```

### 3. (Optional) Get Vapi Workflow ID

If you want to use Vapi workflows for customized interviewer behavior:

1. Create a new workflow in Vapi dashboard
2. Configure the workflow with your interview settings
3. Copy the workflow ID to `.env`

## Using the AI Interviewer

### For Students

1. Navigate to **Student Dashboard** → **Interview Practice**
2. Click on **"AI Voice Interview (NEW!)"** card
3. Ensure microphone and speaker permissions are granted
4. Click **"Start Interview Call"**
5. Wait for the AI to greet you
6. Speak naturally - your responses will be transcribed
7. Click **"End Call"** when done
8. Your transcript is saved automatically

### Supported Interview Types

The AI Interviewer comes with pre-configured questions for:

1. **Technical Interviews**
   - General technical knowledge
   - Problem-solving approaches
   - Technology-specific questions

2. **Behavioral Interviews**
   - Personal experiences
   - Conflict resolution
   - Team collaboration

3. **HR Interviews**
   - Career goals
   - Motivation
   - Work environment preferences

4. **Custom Questions**
   - Add your own questions
   - Tailored to specific roles
   - Practice domain-specific topics

## Component Integration

The AI Interviewer component is located at:
```
client/src/components/AIInterviewer.tsx
```

It can be imported and used in any page:

```tsx
import AIInterviewer from '@/components/AIInterviewer';

<AIInterviewer
  userName="John Doe"
  userId="user-123"
  questions={["Tell me about yourself", "What are your strengths?"]}
  onFinish={(transcript) => console.log(transcript)}
/>
```

## Configuration Files

### Main Files Created:

1. **`client/src/components/AIInterviewer.tsx`** - Main AI Interviewer component
2. **`client/src/lib/vapi.ts`** - Vapi SDK initialization
3. **`client/src/lib/vapi-config.ts`** - Interviewer configuration

### Modified Files:

1. **`client/src/pages/student/InterviewPractice.tsx`** - Added AI Voice Interview UI
2. **`.env`** - Added Vapi configuration options

## Vapi Configuration Details

### Interviewer Configuration

The default interviewer uses:
- **Provider**: OpenAI GPT-4
- **Voice**: ElevenLabs (Sarah voice)
- **Transcription**: Deepgram Nova-2
- **Stability**: 0.4 (natural, expressive)
- **Speed**: 0.9 (slightly faster, professional)

You can modify these in `client/src/lib/vapi-config.ts`

## Troubleshooting

### "Vapi token not configured" Message

**Solution**: Add your Vapi token to `.env`:
```env
VITE_VAPI_WEB_TOKEN=your_token_here
```

### Microphone Not Working

1. Check browser permissions for microphone access
2. Ensure another app isn't using the microphone
3. Test microphone in browser settings
4. Try a different browser

### No Audio from AI

1. Check speaker volume
2. Ensure device audio is not muted
3. Try different audio output device
4. Check Vapi token is valid

### Call Disconnects Immediately

1. Check internet connection
2. Verify Vapi token is active
3. Check browser console for errors
4. Ensure firewall isn't blocking audio

## API Endpoint Requirements

The AI Interviewer component runs entirely on the client-side with Vapi. No additional backend endpoints are required. However, you can add endpoints if you want to:

1. **Save Interview Transcripts**
```
POST /api/student/interview-transcripts
Body: { transcript: Message[], timestamp: Date }
```

2. **Analyze Interview Performance**
```
POST /api/student/interview-analysis
Body: { transcript: Message[] }
Returns: { score: number, feedback: string[] }
```

3. **Store Interview History**
```
GET /api/student/interview-history
Returns: { interviews: Interview[] }
```

## Future Enhancements

- [ ] Multi-language support
- [ ] Recording and playback
- [ ] AI performance analytics
- [ ] Comparison with real interviews
- [ ] Interview difficulty levels
- [ ] Custom company-specific interviews
- [ ] Real-time feedback overlay
- [ ] Stress test interviews

## Support & Documentation

- **Vapi Docs**: https://docs.vapi.ai
- **Component Props**: See `AIInterviewerProps` interface in `AIInterviewer.tsx`
- **Vapi Web SDK**: https://github.com/VapiAI/web-js

## Notes

- The component gracefully handles missing Vapi tokens with helpful configuration messages
- All responses are stored in component state and can be persisted to backend
- The interviewer uses structured question flows with follow-up capabilities
- Minimum 5-10 seconds should be allowed for the AI to process responses

---

**Added by**: AI Integration
**Date**: January 17, 2026
**Version**: 1.0
