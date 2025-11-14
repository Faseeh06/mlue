"use client";

import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  BarChart3
} from 'lucide-react';

interface DashboardToggleProps {
  currentView: 'chat' | 'full';
  onViewChange: (view: 'chat' | 'full') => void;
}

export function DashboardToggle({ currentView, onViewChange }: DashboardToggleProps) {
  const toggleButtons = [
    {
      id: 'chat',
      label: 'AI Chat',
      icon: MessageCircle,
      description: 'Talk to AI'
    },
    {
      id: 'full',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Full View'
    }
  ];

  // Quick Actions removed per request

  return (
    <div className="space-y-6">
      {/* Main Toggle */}
      <div className="flex justify-center">
        <div className="bg-transparent border border-gray-200/50 rounded-lg p-1 flex">
          {toggleButtons.map((button) => {
            const Icon = button.icon;
            const isActive = currentView === button.id;
            
            return (
              <Button
                key={button.id}
                onClick={() => onViewChange(button.id as 'chat' | 'full')}
                variant={isActive ? 'default' : 'ghost'}
                className={`flex-1 ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white border-0' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                size="sm"
              >
                <Icon className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-light text-sm">{button.label}</div>
                  <div className="text-xs opacity-70">{button.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions removed */}
    </div>
  );
}
