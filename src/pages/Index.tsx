import { Gauges } from '@/components/Gauges';
import { MainLayout } from '@/components/MainLayout';
import { useState, useEffect } from 'react';
import MemoryTab from '@/components/MemoryTab';
import { ipcRenderer } from 'electron';
import { CHANNELS, type MemoryInfo } from '@/shared/ipc';
import { CPUTab } from '@/pages/CPU';
import { GPUTab } from '@/pages/GPU';
import { SettingsTab } from '@/pages/Settings';

export default function Index() {
  const [activeTab, setActiveTab] = useState('memory');
  const [ramPercent, setRamPercent] = useState('--');

  useEffect(() => {
    const handleMemoryInfoUpdated = (_event: any, info: MemoryInfo) => {
      setRamPercent(`${info.usedPercentage}`);
    };
    ipcRenderer.on('memory-info-updated', handleMemoryInfoUpdated);
    ipcRenderer.invoke(CHANNELS.MEMORY_INFO).then((info: MemoryInfo) => {
      setRamPercent(`${info.usedPercentage}`);
    });
    return () => {
      ipcRenderer.removeListener('memory-info-updated', handleMemoryInfoUpdated);
    };
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'memory':
        return <MemoryTab />;
      case 'cpu':
        return <CPUTab />;
      case 'gpu':
        return <GPUTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Gauges ramPercent={ramPercent} cpuPercent="--" gpuPercent="--" />
      <div className="flex-1 overflow-auto">
        {renderTab()}
      </div>
    </MainLayout>
  );
}