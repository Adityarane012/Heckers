/**
 * StreamingResponse Component
 * 
 * A component that displays streaming responses from AI agents with
 * real-time updates, typing animation, and progress tracking.
 * 
 * Usage:
 * ```tsx
 * <StreamingResponse
 *   response={streamingData}
 *   onComplete={(data) => console.log('Complete:', data)}
 *   showProgress={true}
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  User, 
  Copy, 
  Download, 
  Check, 
  AlertCircle,
  Loader2,
  Pause,
  Play,
  Square
} from 'lucide-react';

export interface StreamingResponseProps {
  response: StreamingData;
  onComplete?: (data: any) => void;
  onError?: (error: string) => void;
  showProgress?: boolean;
  showControls?: boolean;
  autoScroll?: boolean;
  className?: string;
  maxHeight?: string;
}

export interface StreamingData {
  content: string;
  isComplete: boolean;
  progress?: number;
  status?: 'pending' | 'streaming' | 'complete' | 'error';
  error?: string;
  metadata?: {
    agentId?: string;
    timestamp?: number;
    processingTime?: number;
    tokensUsed?: number;
  };
}

export const StreamingResponse: React.FC<StreamingResponseProps> = ({
  response,
  onComplete,
  onError,
  showProgress = true,
  showControls = true,
  autoScroll = true,
  className = '',
  maxHeight = '400px',
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle streaming content with typing animation
  useEffect(() => {
    if (isPaused) return;

    const targetContent = response.content;
    const currentLength = displayedContent.length;

    if (currentLength < targetContent.length) {
      setIsTyping(true);
      
      // Simulate typing effect
      const nextChar = targetContent[currentLength];
      setDisplayedContent(prev => prev + nextChar);

      // Variable typing speed based on character type
      const delay = nextChar === '\n' ? 100 : 
                   nextChar === '.' ? 200 : 
                   nextChar === ',' ? 150 : 
                   Math.random() * 50 + 20;

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, delay);
    } else {
      setIsTyping(false);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [response.content, displayedContent, isPaused]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [displayedContent, autoScroll]);

  // Handle completion
  useEffect(() => {
    if (response.isComplete && onComplete) {
      onComplete(response);
    }
  }, [response.isComplete, onComplete]);

  // Handle errors
  useEffect(() => {
    if (response.error && onError) {
      onError(response.error);
    }
  }, [response.error, onError]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([displayedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-response-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsPaused(true);
    setDisplayedContent(response.content);
  };

  const getStatusIcon = () => {
    switch (response.status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'streaming':
        return isTyping ? (
          <div className="flex items-center space-x-1">
            <div className="w-1 h-4 bg-blue-500 animate-pulse"></div>
            <div className="w-1 h-4 bg-blue-500 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-4 bg-blue-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        ) : (
          <Bot className="h-4 w-4 text-blue-500" />
        );
      case 'complete':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bot className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (response.status) {
      case 'pending':
        return <Badge variant="secondary">Preparing...</Badge>;
      case 'streaming':
        return <Badge variant="default">Generating...</Badge>;
      case 'complete':
        return <Badge variant="default" className="bg-green-500">Complete</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">AI Response</CardTitle>
            {response.metadata?.agentId && (
              <Badge variant="outline" className="text-xs">
                {response.metadata.agentId}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge()}
            {showControls && response.status === 'streaming' && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePause}
                  className="h-6 w-6 p-0"
                >
                  {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStop}
                  className="h-6 w-6 p-0"
                >
                  <Square className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {showProgress && response.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(response.progress)}%</span>
            </div>
            <Progress value={response.progress} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea 
          ref={scrollAreaRef}
          className="w-full"
          style={{ maxHeight }}
        >
          <div className="space-y-4">
            {response.error ? (
              <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">Error occurred</p>
                  <p>{response.error}</p>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {displayedContent}
                  {isTyping && (
                    <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1"></span>
                  )}
                </div>
              </div>
            )}

            {response.metadata && (
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <div className="flex items-center space-x-4">
                  {response.metadata.timestamp && (
                    <span>
                      {new Date(response.metadata.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                  {response.metadata.processingTime && (
                    <span>
                      {response.metadata.processingTime}ms
                    </span>
                  )}
                  {response.metadata.tokensUsed && (
                    <span>
                      {response.metadata.tokensUsed} tokens
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-6 px-2 text-xs"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="h-6 px-2 text-xs"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default StreamingResponse;
