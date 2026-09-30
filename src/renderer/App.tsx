import { useState, useEffect } from 'react';
import { MemoryTab } from '@pages/Memory';
import { CPUTab } from '@pages/CPU';
import { GPUTab } from '@pages/GPU';
import { SettingsTab } from '@pages/Settings';
import { MainLayout } from '@components/MainLayout';
import { Gauges } from '@components/Gauges';
import { cn } from '@lib/utils';

type TabValue = 'memory' | 'cpu' | 'gpu' | 'settings';

export function App() {
  const [activeTab, setActiveTab] = useState<TabValue>('memory');
  const [ramPercent, setRamPercent] = useState('--');
  const [cpuPercent, setCpuPercent] = useState('--');
  const [gpuPercent, setGpuPercent] = useState('--');

  return (
    <MainLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <Gauges
        ramPercent={ramPercent}
        cpuPercent={cpuPercent}
        gpuPercent={gpuPercent}
      />
      <div className="flex-1 overflow-auto">
        {activeTab === 'memory' && <MemoryTab />}
        {activeTab === 'cpu' && <CPUTab />}
        {activeTab === 'gpu' && <GPUTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </MainLayout>
  );
}