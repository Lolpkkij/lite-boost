import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CHANNELS, type MemoryInfo } from '@/shared/ipc';
import { Zap, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProcessInfo {
  pid: number;
  name: string;
  workingSet: number;
  privateBytes: number;
}

const MemoryTab: React.FC = () => {
  const { toast } = useToast();
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null);
  const [processList, setProcessList] = useState<ProcessInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCleaning, setIsCleaning] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ProcessInfo; direction: 'ascending' | 'descending' }>(
    { key: 'workingSet', direction: 'descending' }
  );

  useEffect(() => {
    const handleMemoryInfoUpdated = (_event: any, info: MemoryInfo) => {
      setMemoryInfo(info);
    };
    const handleProcessListUpdated = (_event: any, list: ProcessInfo[]) => {
      setProcessList(list);
    };
    ipcRenderer.on('memory-info-updated', handleMemoryInfoUpdated);
    ipcRenderer.on('process-list-updated', handleProcessListUpdated);
    ipcRenderer.invoke(CHANNELS.MEMORY_INFO).then(setMemoryInfo);
    ipcRenderer.invoke(CHANNELS.PROCESS_LIST).then(setProcessList);
    return () => {
      ipcRenderer.removeListener('memory-info-updated', handleMemoryInfoUpdated);
      ipcRenderer.removeListener('process-list-updated', handleProcessListUpdated);
    };
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCleanMemory = async (mode: string) => {
    setIsCleaning(true);
    try {
      await ipcRenderer.invoke(CHANNELS.MEMORY_CLEAN, mode);
      toast({
        title: "Memory Cleaned",
        description: `Successfully applied ${mode} cleaning.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Cleaning Failed",
        description: "Could not clear system memory.",
      });
    } finally {
      setIsCleaning(false);
    }
  };

  const requestSort = (key: keyof ProcessInfo) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedProcesses = React.useMemo(() => {
    const sortable = [...processList];
    sortable.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
    return sortable;
  }, [processList, sortConfig]);

  const filteredProcesses = React.useMemo(() => {
    return sortedProcesses.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [sortedProcesses, searchTerm]);

  const renderSortArrow = (key: keyof ProcessInfo) =>
    sortConfig.key === key ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : null;

  return (
    <div className="space-y-4 p-4">
      {/* Cleaning Actions Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button 
          onClick={() => handleCleanMemory('Working Set')} 
          disabled={isCleaning}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isCleaning ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
          Clean Working Set
        </Button>
        <Button 
          onClick={() => handleCleanMemory('System Cache')} 
          disabled={isCleaning}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isCleaning ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
          Clean System Cache
        </Button>
        <Button 
          onClick={() => handleCleanMemory('Full Optimization')} 
          disabled={isCleaning}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isCleaning ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Full Optimization
        </Button>
      </div>

      {/* RAM Gauge */}
      <Card className="bg-[#15152b] border-gray-800 text-white">
        <CardHeader>
          <CardTitle>RAM Usage</CardTitle>
        </CardHeader>
        <CardContent>
          {memoryInfo && (
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    strokeDasharray="282.743"
                    strokeDashoffset={`${282.743 * (1 - memoryInfo.usedPercentage / 100)}`}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-500 ease-out"
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="16"
                    fill="white"
                    className="font-bold"
                  >
                    {memoryInfo.usedPercentage}%
                  </text>
                </svg>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                  {formatBytes(memoryInfo.usedBytes)} / {formatBytes(memoryInfo.totalBytes)} used
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Page File Bar */}
      <Card className="bg-[#15152b] border-gray-800 text-white">
        <CardHeader>
          <CardTitle>Page File</CardTitle>
        </CardHeader>
        <CardContent>
          {memoryInfo && (
            <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-500"
                style={{ width: `${(memoryInfo.usedBytes / memoryInfo.totalBytes) * 100}%` }}
              ></div>
              <div className="mt-2 text-center text-sm text-gray-400">
                {formatBytes(memoryInfo.usedBytes)} / {formatBytes(memoryInfo.totalBytes)} used
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Process Table */}
      <Card className="bg-[#15152b] border-gray-800 text-white">
        <CardHeader>
          <CardTitle>Top Processes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input 
              placeholder="Search processes..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="bg-[#1a1a2e] border-gray-700 text-white"
            />
          </div>
          <div className="rounded-md border border-gray-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-900/50">
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="cursor-pointer text-gray-400" onClick={() => requestSort('name')}>
                    Name{renderSortArrow('name')}
                  </TableHead>
                  <TableHead className="cursor-pointer text-gray-400" onClick={() => requestSort('workingSet')}>
                    Working Set{renderSortArrow('workingSet')}
                  </TableHead>
                  <TableHead className="cursor-pointer text-gray-400" onClick={() => requestSort('privateBytes')}>
                    Private Bytes{renderSortArrow('privateBytes')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.map(p => (
                  <TableRow key={p.pid} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{formatBytes(p.workingSet)}</TableCell>
                    <TableCell>{formatBytes(p.privateBytes)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryTab;