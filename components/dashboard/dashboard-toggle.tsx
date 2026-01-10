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
    <div className="space-y-4 sm:space-y-6">
      {/* Main Toggle */}
      <div className="flex justify-center px-2 sm:px-0">
        <div className="bg-secondary/50 border border-foreground/20 rounded-full p-1 sm:p-1.5 flex gap-1.5 sm:gap-2 shadow-sm w-full max-w-md">
          {toggleButtons.map((button) => {
            const Icon = button.icon;
            const isActive = currentView === button.id;
            
            return (
              <Button
                key={button.id}
                onClick={() => onViewChange(button.id as 'chat' | 'full')}
                variant={isActive ? 'default' : 'ghost'}
                className={`flex-1 rounded-full transition-all min-h-[44px] sm:min-h-0 ${
                  isActive 
                    ? 'bg-iris text-white shadow-md shadow-iris/20' 
                    : 'bg-transparent text-foreground/70 hover:text-foreground hover:bg-secondary'
                }`}
                size="lg"
              >
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 flex-shrink-0 ${isActive ? 'text-white' : 'text-foreground/70'}`} />
                <div className="text-left min-w-0">
                  <div className={`font-medium text-sm sm:text-base truncate ${isActive ? 'text-white' : 'text-foreground'}`}>{button.label}</div>
                  <div className={`text-xs sm:text-xs truncate ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>{button.description}</div>
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
