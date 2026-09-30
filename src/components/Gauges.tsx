import { Gauge, Cpu, Video } from 'lucide-react';
import { cn } from '@lib/utils';
import { Progress } from '@components/ui/progress';
import { useEffect, useState } from 'react';

interface GaugesProps {
  ramPercent: string;
  cpuPercent: string;
  gpuPercent: string;
}

export function Gauges({ ramPercent, cpuPercent, gpuPercent }: GaugesProps) {
  const [ramValue, setRamValue] = useState('--');
  const [cpuValue, setCpuValue] = useState('--');
  const [gpuValue, setGpuValue] = useState('--');

  useEffect(() => {
    // Parse percentages for actual progress values
    if (ramPercent !== '--' && ramPercent !== '') {
      const parsed = parseFloat(ramPercent);
      if (!isNaN(parsed) && parsed <= 100) {
        setRamValue(ramPercent);
      }
    }
    if (cpuPercent !== '--' && cpuPercent !== '') {
      const parsed = parseFloat(cpuPercent);
      if (!isNaN(parsed) && parsed <= 100) {
        setCpuValue(cpuPercent);
      }
    }
    if (gpuPercent !== '--' && gpuPercent !== '') {
      const parsed = parseFloat(gpuPercent);
      if (!isNaN(parsed) && parsed <= 100) {
        setGpuValue(cpuPercent);
      }
    }
  }, [ramPercent, cpuPercent, gpuPercent]);

  const gauges = [
    {
      id: 'ram',
      label: 'RAM',
      value: ramPercent,
      icon: Gauge,
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-500',
    },
    {
      id: 'cpu',
      label: 'CPU',
      value: cpuPercent,
      icon: Cpu,
      color: 'from-orange-500 to-orange-600',
      borderColor: 'border-orange-500',
    },
    {
      id: 'gpu',
      label: 'GPU',
      value: gpuPercent,
      icon: Video,
      color: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-800 bg-[#15152b]/50 backdrop-blur-sm">
      {gauges.map((gauge) => {
        const Icon = gauge.icon;
        const percent = gauge.value === '--' ? 0 : parseInt(gauge.value);

        return (
          <div
            key={gauge.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg bg-[#1a1a2e]/80 backdrop-blur-sm',
              'hover:bg-[#1a1a2e] transition-colors duration-200'
            )}
          >
            <div className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br ${gauge.color}`}>
              <Icon className="size-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {gauge.label}
                </span>
                <span className={cn(
                                  'text-sm font-bold',
                                  percent >= 90 ? 'text-red-400' :
                                  percent >= 70 ? 'text-yellow-400' :
                                  percent >= 50 ? 'text-green-400' :
                                  'text-gray-300'
                                )}>
                  {gauge.value}
                </span>
              </div>
              <Progress
                value={percent}
                className={cn('h-1.5 bg-gray-800', gauge.borderColor)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}