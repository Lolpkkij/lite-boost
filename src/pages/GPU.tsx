import { useState } from 'react';
import { useState } from 'react';
import { Video, Activity, Zap, Monitor } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Progress } from '@components/ui/progress';

export function GPUTab() {
  const [loadPercent, setLoadPercent] = useState('--');
  const [temp, setTemp] = useState('--');

  return (
    <div className="flex size-full flex-col gap-4 p-6">
      <Card className="border-purple-900/50 bg-gradient-to-r from-purple-900/10 to-blue-900/10 shadow-lg shadow-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5 text-purple-400" />
            GPU Overview
          </CardTitle>
          <CardDescription className="text-gray-400">
            Monitor your graphics card performance
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card className="border-gray-800 bg-[#15152b] shadow-lg shadow-black/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-5 text-purple-400" />
              GPU Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadPercent === '--' ? (
              <div className="flex size-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-800">
                <p className="text-sm text-gray-500">No data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-300">Current GPU Load: {loadPercent}%</span>
                  </div>
                  <Progress value={parseInt(loadPercent) || 0} className="h-3 bg-gray-800">
                    <div className={`h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500`} style={{ width: `${loadPercent}%` }} />
                  </Progress>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg bg-[#1a1a2e] p-3 border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">GPU Type</p>
                    <p className="text-sm font-medium text-gray-300">Discrete NVIDIA GPU</p>
                  </div>
                  <div className="rounded-lg bg-[#1a1a2e] p-3 border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">VRAM</p>
                    <p className="text-sm font-medium text-gray-300">4 GB</p>
                  </div>
                  <div className="rounded-lg bg-[#1a1a2e] p-3 border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Driver Version</p>
                    <p className="text-sm font-medium text-gray-300">545.23.06</p>
                  </div>
                  <div className="rounded-lg bg-[#1a1a2e] p-3 border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Clock Speed</p>
                    <p className="text-sm font-medium text-gray-300">1.8 GHz</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-[#15152b] shadow-lg shadow-black/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="size-5 text-purple-400" />
              GPU Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            {temp === '--' ? (
              <div className="flex size-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-800">
                <p className="text-sm text-gray-500">No data available</p>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-8">
                <div>
                  <div className="mb-4">
                    <Monitor className="mx-auto mb-4 size-12 text-purple-400" />
                  </div>
                  <div className="mb-4 space-y-2">
                    <div className="text-6xl font-bold text-white">
                      {temp}
                    </div>
                    <div className="text-center text-xs text-gray-500 uppercase tracking-wider">
                      Degrees Celsius
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#1a1a2e] p-3 border border-gray-800 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Min</span>
                      <span className="text-gray-200">35°C</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Max</span>
                      <span className="text-gray-200">58°C</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Current</span>
                      <span className="text-purple-400">{temp}°C</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}