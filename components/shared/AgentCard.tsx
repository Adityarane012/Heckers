/**
 * AgentCard Component
 * 
 * A reusable card component for displaying AI agent information,
 * status, and quick actions in a consistent format.
 * 
 * Usage:
 * ```tsx
 * <AgentCard
 *   agent={agentData}
 *   onSelect={() => console.log('Selected')}
 *   showStatus={true}
 *   showActions={true}
 />
 * ```
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Play, 
  Settings, 
  BarChart3, 
  BookOpen, 
  TrendingUp,
  MessageSquare,
  Newspaper,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Clock,
  Users
} from 'lucide-react';

export interface AgentCardProps {
  agent: AgentData;
  onSelect?: () => void;
  onConfigure?: () => void;
  onViewStats?: () => void;
  showStatus?: boolean;
  showActions?: boolean;
  showProgress?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export interface AgentData {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  health: 'healthy' | 'degraded' | 'unhealthy';
  usage: {
    totalRequests: number;
    successRate: number;
    averageResponseTime: number;
    lastUsed?: number;
  };
  capabilities: string[];
  category: 'strategy' | 'analysis' | 'coaching' | 'news' | 'mentor';
  version: string;
  lastUpdated: number;
  progress?: {
    current: number;
    total: number;
    label: string;
  };
  metrics?: {
    accuracy: number;
    speed: number;
    reliability: number;
  };
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onSelect,
  onConfigure,
  onViewStats,
  showStatus = true,
  showActions = true,
  showProgress = false,
  variant = 'default',
  className = '',
}) => {
  const getAgentIcon = () => {
    switch (agent.category) {
      case 'strategy':
        return <TrendingUp className="h-5 w-5" />;
      case 'analysis':
        return <BarChart3 className="h-5 w-5" />;
      case 'coaching':
        return <MessageSquare className="h-5 w-5" />;
      case 'news':
        return <Newspaper className="h-5 w-5" />;
      case 'mentor':
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <Bot className="h-5 w-5" />;
    }
  };

  const getStatusIcon = () => {
    switch (agent.status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'maintenance':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getHealthBadge = () => {
    switch (agent.health) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-500">Healthy</Badge>;
      case 'degraded':
        return <Badge variant="default" className="bg-yellow-500">Degraded</Badge>;
      case 'unhealthy':
        return <Badge variant="destructive">Unhealthy</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusBadge = () => {
    switch (agent.status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'maintenance':
        return <Badge variant="default" className="bg-yellow-500">Maintenance</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatLastUsed = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (variant === 'compact') {
    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-md ${className}`}
        onClick={onSelect}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {getAgentIcon()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium truncate">{agent.name}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {agent.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {showStatus && getHealthBadge()}
              {showActions && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Play className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {getAgentIcon()}
              </div>
              <div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {agent.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge()}
              {getHealthBadge()}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Capabilities */}
          <div>
            <h4 className="text-sm font-medium mb-2">Capabilities</h4>
            <div className="flex flex-wrap gap-1">
              {agent.capabilities.map((capability, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {capability}
                </Badge>
              ))}
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{agent.usage.totalRequests.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(agent.usage.successRate * 100)}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>

          {/* Metrics */}
          {agent.metrics && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Performance Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Accuracy</span>
                  <span>{Math.round(agent.metrics.accuracy * 100)}%</span>
                </div>
                <Progress value={agent.metrics.accuracy * 100} className="h-1" />
                
                <div className="flex justify-between text-xs">
                  <span>Speed</span>
                  <span>{Math.round(agent.metrics.speed * 100)}%</span>
                </div>
                <Progress value={agent.metrics.speed * 100} className="h-1" />
                
                <div className="flex justify-between text-xs">
                  <span>Reliability</span>
                  <span>{Math.round(agent.metrics.reliability * 100)}%</span>
                </div>
                <Progress value={agent.metrics.reliability * 100} className="h-1" />
              </div>
            </div>
          )}

          {/* Progress */}
          {showProgress && agent.progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{agent.progress.label}</span>
                <span>{agent.progress.current}/{agent.progress.total}</span>
              </div>
              <Progress 
                value={(agent.progress.current / agent.progress.total) * 100} 
                className="h-2" 
              />
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-2 pt-2">
              <Button onClick={onSelect} className="flex-1" size="sm">
                <Play className="mr-2 h-4 w-4" />
                Use Agent
              </Button>
              {onConfigure && (
                <Button variant="outline" size="sm" onClick={onConfigure}>
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              {onViewStats && (
                <Button variant="outline" size="sm" onClick={onViewStats}>
                  <BarChart3 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>v{agent.version}</span>
            <span>Last used: {formatLastUsed(agent.usage.lastUsed)}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${className}`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {getAgentIcon()}
            </div>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {agent.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {showStatus && getHealthBadge()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Capabilities */}
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.slice(0, 3).map((capability, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {capability}
            </Badge>
          ))}
          {agent.capabilities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{agent.capabilities.length - 3} more
            </Badge>
          )}
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-semibold">{agent.usage.totalRequests.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Requests</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{Math.round(agent.usage.successRate * 100)}%</div>
            <div className="text-xs text-muted-foreground">Success</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{agent.usage.averageResponseTime}ms</div>
            <div className="text-xs text-muted-foreground">Avg Time</div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            <Button onClick={onSelect} className="flex-1" size="sm">
              <Play className="mr-2 h-4 w-4" />
              Use Agent
            </Button>
            {onConfigure && (
              <Button variant="outline" size="sm" onClick={onConfigure}>
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>v{agent.version}</span>
          <span>{formatLastUsed(agent.usage.lastUsed)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
