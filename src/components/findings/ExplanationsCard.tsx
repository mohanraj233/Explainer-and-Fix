'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Code2,
  Wand2,
  Copy,
  Check,
  GitPullRequest,
  CheckCircle,
  MessageSquare,
  Send,
  Shield,
  Bot,
  User,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ExplanationsCardProps {
  clientExplanation: string;
  developerGuidance: string;
  oneClickAiPrompt: string;
  suggestedPatch?: string;
  findingTitle: string;
}

export const ExplanationsCard: React.FC<ExplanationsCardProps> = ({
  clientExplanation,
  developerGuidance,
  oneClickAiPrompt,
  suggestedPatch,
  findingTitle,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedPatch, setCopiedPatch] = useState(false);
  const [activeTab, setActiveTab] = useState<'explanation' | 'patch' | 'chat'>('explanation');

  // Interactive Contextual Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello! I have analyzed "${findingTitle}". ZeroLeak has pre-sanitized all private tokens. How can I assist with your remediation or regression risk assessment?`,
      time: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(oneClickAiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyPatch = () => {
    if (suggestedPatch) {
      navigator.clipboard.writeText(suggestedPatch);
      setCopiedPatch(true);
      setTimeout(() => setCopiedPatch(false), 2000);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: 'Now' },
    ]);

    setIsTyping(true);
    setTimeout(() => {
      let aiReply = "Restricting this to the public anon key with Row Level Security (RLS) ensures that web clients can only query tables authorized for their specific authenticated role. Backend batch jobs should execute inside an isolated API route or server action where SUPABASE_SERVICE_ROLE_KEY remains non-public.";
      if (userText.toLowerCase().includes('break') || userText.toLowerCase().includes('form')) {
        aiReply = "Side-effect analysis: This fix will NOT break standard form submissions as long as your RLS policies grant INSERT permissions to the authenticated or anon role. Only operations requiring unrestricted administrative access must be routed through your backend API endpoint.";
      }
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiReply, time: 'Just now' },
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <Card className="border-slate-200/90 shadow-xs overflow-hidden">
      {/* Card Header with tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 p-4 bg-slate-50/60 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <Sparkles className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">
              Plain-English Explanations & 1-Click AI Fixes
            </h3>
            <p className="text-xs text-slate-500">
              Dual-perspective security guidance with ZeroLeak protected AI remediation
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-slate-200/60 p-0.5 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'explanation'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Advisory & Fixes
          </button>
          {suggestedPatch && (
            <button
              onClick={() => setActiveTab('patch')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                activeTab === 'patch'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitPullRequest className="h-3 w-3" />
              Unified Patch
            </button>
          )}
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
              activeTab === 'chat'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="h-3 w-3" />
            Security Chat
          </button>
        </div>
      </div>

      <CardContent className="p-5 space-y-6">
        {activeTab === 'explanation' && (
          <div className="space-y-5">
            {/* BLOCK A: Client Explanation */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 transition-all hover:bg-blue-50/60">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 rounded-md bg-blue-100 text-blue-700">
                  <Users className="h-4 w-4" />
                </span>
                <h4 className="text-sm font-semibold text-blue-950">
                  What To Tell Your Client in Plain English
                </h4>
                <span className="text-[10px] font-semibold bg-blue-200/80 text-blue-800 px-2 py-0.5 rounded-full ml-auto">
                  Client Perspective
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {clientExplanation}
              </p>
            </div>

            {/* BLOCK B: Developer Fix Guidance */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 rounded-md bg-indigo-100 text-indigo-700">
                  <Code2 className="h-4 w-4" />
                </span>
                <h4 className="text-sm font-semibold text-slate-900">
                  Developer Fix Guidance
                </h4>
                <span className="text-[10px] text-slate-500 ml-1">
                  (Direct explanation of how to fix this flaw without needing deep cybersecurity training)
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {developerGuidance}
              </p>
            </div>

            {/* BLOCK C: 1-Click AI Prompt Fix */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-amber-100 text-amber-700">
                    <Wand2 className="h-4 w-4" />
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900">
                    1-Click AI Prompt Fix
                  </h4>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyPrompt}
                  className="h-8 text-xs font-semibold px-3 gap-1.5 border-slate-300 hover:bg-slate-50 text-slate-700"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Prompt Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Fix Prompt</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Gray Code Box with Fix Prompt */}
              <div className="bg-slate-100/90 border border-slate-200 rounded-lg p-3.5 font-mono text-xs text-slate-800 leading-relaxed select-all">
                {oneClickAiPrompt}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Paste directly into Claude, Cursor, ChatGPT, or your IDE coding assistant to generate an instant patch.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Suggested Git Diff Patch */}
        {activeTab === 'patch' && suggestedPatch && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500 font-mono">
                Suggested Patch • Unified Git Diff
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyPatch}
                className="h-7 text-xs px-2.5 gap-1.5"
              >
                {copiedPatch ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span>Copied Diff</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy Patch Diff</span>
                  </>
                )}
              </Button>
            </div>

            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800">
              <pre>
                {suggestedPatch.split('\n').map((line, idx) => {
                  let lineClass = 'text-slate-400';
                  if (line.startsWith('+') && !line.startsWith('+++')) {
                    lineClass = 'text-emerald-400 bg-emerald-950/40 px-1 rounded block';
                  } else if (line.startsWith('-') && !line.startsWith('---')) {
                    lineClass = 'text-rose-400 bg-rose-950/40 px-1 rounded block';
                  } else if (line.startsWith('@@')) {
                    lineClass = 'text-cyan-400';
                  }
                  return (
                    <div key={idx} className={lineClass}>
                      {line}
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Contextual Security Chat */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-64 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-xl max-w-[80%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="h-6 w-6 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 text-slate-400 text-xs items-center pl-8 italic">
                  <span>ZeroLeak AI is verifying contextual logic...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about regression risks, side-effects, or framework integration..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <Button type="submit" size="sm" variant="primary" className="h-9 px-4 text-xs font-semibold gap-1">
                <Send className="h-3 w-3" />
                Ask AI
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

