import { Gauges } from '@/components/Gauges';
import { MainLayout } from '@/components/MainLayout';
import { useState, useEffect } from 'react';
import MemoryTab from '@/components/MemoryTab';
import { ipcRenderer } from 'electron';
import { CHANNELS, type MemoryInfo } from '@/shared/ipc';

export default function Index() {
  const [activeTab, setActiveTab] = useState('memory');
  const [ramPercent, setRamPercent] = useState('--');

  useEffect(() => {
    const handleMemoryInfoUpdated = (_event: any, info: MemoryInfo) => {
      setRamPercent(`${info.usedPercentage}`);
    };
    ipcRenderer.on('memory-info-updated', handleMemoryInfoUpdated);
    // Initial fetch
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
        // placeholder cpu component
        return <div>CPU Tab</div>;
      case 'gpu':
        return <div>GPU Tab</div>;
      case 'settings':
        return <div>Settings</div>;
      default:
        return null;
    }
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Top RAM gauge */}
      <Gauges ramPercent={ramPercent} cpuPercent="--" gpuPercent="--" />
      {renderTab()}
    </MainLayout>
  );
}