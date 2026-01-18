'use client';

import { useState, useEffect } from 'react';
import { vapi } from '@/lib/vapi';
import { interviewer } from '@/lib/vapi-config';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface AIInterviewerProps {
  userName?: string;
  userId?: string;
  questions?: string[];
  onFinish?: (transcript: any[]) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIInterviewer({
  userName = 'Candidate',
  userId,
  questions = [],
  onFinish,
}: AIInterviewerProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>('');
  const [hasVapiToken, setHasVapiToken] = useState(false);

  useEffect(() => {
    // Check if Vapi token is available
    const token = import.meta.env.VITE_VAPI_WEB_TOKEN;
    setHasVapiToken(!!token && token !== 'dummy-token');
  }, []);

  useEffect(() => {
    if (!hasVapiToken) return;

    const onCallStart = () => {
      console.log('Call started');
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log('Call ended');
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      console.log('Message received:', message);
      if (
        message.type === 'transcript' &&
        message.transcriptType === 'final'
      ) {
        const newMessage: Message = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prev) => [...prev, newMessage]);
        setLastMessage(message.transcript);
      }
    };

    const onSpeechStart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error('Vapi error:', error);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    };
  }, [hasVapiToken]);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED && messages.length > 0 && onFinish) {
      onFinish(messages);
    }
  }, [callStatus, messages, onFinish]);

  const handleStartCall = async () => {
    if (!hasVapiToken) {
      alert('Vapi token not configured. Please add VITE_VAPI_WEB_TOKEN to your environment.');
      return;
    }

    try {
      setCallStatus(CallStatus.CONNECTING);
      let formattedQuestions = '';
      if (questions && questions.length > 0) {
        formattedQuestions = questions
          .map((q) => `- ${q}`)
          .join('\n');
      } else {
        formattedQuestions = `- Tell me about yourself and your background.
- What are your key strengths and how do they relate to this role?
- Describe a challenging project you've worked on and how you overcame the obstacles.
- Why are you interested in this position and our company?
- What is your ideal work environment?`;
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus(CallStatus.INACTIVE);
      alert('Failed to start interview. Please check your Vapi configuration.');
    }
  };

  const handleEndCall = () => {
    vapi.stop();
    setCallStatus(CallStatus.FINISHED);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="space-y-6">
          {/* AI Interviewer Status */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isSpeaking
                ? 'bg-green-500 ring-4 ring-green-300 animate-pulse'
                : 'bg-blue-500'
            }`}>
              <Mic className="w-10 h-10 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">AI Interviewer</h2>
              <p className="text-sm text-gray-400 mt-1">
                Status: {
                  callStatus === CallStatus.INACTIVE ? 'Ready' :
                  callStatus === CallStatus.CONNECTING ? 'Connecting...' :
                  callStatus === CallStatus.ACTIVE ? 'In Call' :
                  'Finished'
                }
              </p>
            </div>
          </div>

          {/* User Profile */}
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <p className="text-gray-300">Interviewing:</p>
            <p className="text-white font-semibold text-lg">{userName}</p>
          </div>

          {/* Transcript Display */}
          {lastMessage && (
            <Card className="bg-slate-700 border-slate-600 p-4 min-h-20">
              <div className="space-y-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Latest Message
                </p>
                <p className="text-white animate-fade-in">{lastMessage}</p>
              </div>
            </Card>
          )}

          {/* Messages History */}
          {messages.length > 0 && (
            <Card className="bg-slate-700 border-slate-600 p-4 max-h-48 overflow-y-auto">
              <div className="space-y-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Interview Transcript
                </p>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${
                      msg.role === 'assistant'
                        ? 'bg-blue-900 text-blue-100'
                        : 'bg-green-900 text-green-100'
                    }`}
                  >
                    <p className="text-xs font-semibold capitalize mb-1">
                      {msg.role === 'assistant' ? 'Interviewer' : 'You'}
                    </p>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Control Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            {callStatus !== CallStatus.ACTIVE ? (
              <Button
                onClick={handleStartCall}
                disabled={
                  callStatus === CallStatus.CONNECTING ||
                  !hasVapiToken
                }
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Phone className="w-4 h-4" />
                {callStatus === CallStatus.CONNECTING
                  ? 'Connecting...'
                  : callStatus === CallStatus.FINISHED
                    ? 'Start Again'
                    : 'Start Interview Call'}
              </Button>
            ) : (
              <Button
                onClick={handleEndCall}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                size="lg"
              >
                <PhoneOff className="w-4 h-4" />
                End Call
              </Button>
            )}
          </div>

          {!hasVapiToken && (
            <div className="bg-yellow-900 border border-yellow-700 rounded p-3 text-yellow-200 text-sm">
              <p className="font-semibold mb-1">⚠️ Configuration Required</p>
              <p>Please add VITE_VAPI_WEB_TOKEN to your .env file to enable AI interviews.</p>
              <p className="mt-2 text-xs">Get your token from: <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer" className="underline">vapi.ai</a></p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-slate-700 rounded p-4 text-sm text-gray-300">
            <p className="font-semibold text-white mb-2">How it works:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Click "Start Interview Call" to begin</li>
              <li>Allow microphone and speaker access when prompted</li>
              <li>Answer the interviewer's questions naturally</li>
              <li>Click "End Call" when finished</li>
              <li>Your responses will be transcribed and saved</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
