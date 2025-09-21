/**
 * ProgressIndicator Component
 * 
 * A reusable progress indicator component that shows real-time progress
 * for AI agent operations with streaming updates and error handling.
 * 
 * Usage:
 * ```tsx
 * <ProgressIndicator
 *   progress={75}
 *   message="Generating strategy..."
 *   status="in_progress"
 *   onCancel={() => console.log('Cancelled')}
 * />
 * ```
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, Loader2, X } from 'lucide-react';

export interface ProgressIndicatorProps {
  progress: number;
  message: string;
  status: 'pending' | 'in_progress' | 'done' | 'error';
  error?: string;
  onCancel?: () => void;
  showCancel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'detailed';
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  message,
  status,
  error,
  onCancel,
  showCancel = true,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'in_progress':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'done':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-blue-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'done':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="default">In Progress</Badge>;
      case 'done':
        return <Badge variant="default" className="bg-green-500">Complete</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getStatusIcon()}
        <span className="text-sm text-muted-foreground">{message}</span>
        {status === 'in_progress' && (
          <div className="w-16">
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={`${className}`}>
        <CardContent className={sizeClasses[size]}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="font-medium">{message}</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge()}
                {showCancel && status === 'in_progress' && onCancel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {status === 'in_progress' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {status === 'error' && error && (
              <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">Error occurred</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {status === 'done' && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Operation completed successfully</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={`${className}`}>
      <CardContent className={sizeClasses[size]}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">{message}</span>
            </div>
            {getStatusBadge()}
          </div>

          {status === 'in_progress' && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          )}

          {status === 'error' && error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {showCancel && status === 'in_progress' && onCancel && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressIndicator;
