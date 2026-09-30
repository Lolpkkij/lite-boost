import { cn } from '@/lib/utils';
import { Activity, Cpu, Settings, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const tabs = [
  { id: 'memory', label: 'Memory', icon: Activity },
  { id: 'cpu', label: 'CPU', icon: Cpu },
  { id: 'gpu', label: 'GPU', icon: Cpu },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function MainLayout({ activeTab, onTabChange, children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="flex size-full bg-[#1a1a2e] text-gray-100">
      <aside
        className={cn(
          'flex flex-col border-r border-gray-800 bg-[#15152b] text-gray-300',
          sidebarOpen ? 'w-60' : 'w-16',
          'transition-all duration-300',
          isMinimized ? '-translate-x-full' : 'translate-x-0'
        )}
      >
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-xl">⚡</span>
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-white">LiteBoost</h1>
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50'
                    : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200',
                  'group'
                )}
              >
                <span className={cn('text-lg', activeTab === tab.id ? 'opacity-100' : 'opacity-60')}>
                  <Icon size={20} />
                </span>
                {sidebarOpen && (
                  <span className={cn(
                    'whitespace-nowrap text-sm font-medium',
                    activeTab === tab.id ? 'opacity-100' : 'opacity-60'
                  )}>
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-2 border-t border-gray-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="w-full justify-start opacity-60 hover:opacity-100"
          >
            <X className="size-4" />
            {sidebarOpen && <span className="ml-2 text-sm">Hide</span>}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMinimized(false)}
        className={cn(
          'absolute bottom-4 right-4 size-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600',
          'text-white shadow-lg shadow-blue-900/50 hover:shadow-blue-700/70 hover:scale-110',
          'transition-all duration-300',
          !isMinimized && 'opacity-0 pointer-events-none'
        )}
        title="Show window"
      >
        <X className="size-4 -rotate-45" />
      </Button>
    </div>
  );
}