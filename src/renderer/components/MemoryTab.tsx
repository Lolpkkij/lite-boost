import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CHANNELS, type MemoryInfo } from '@/shared/ipc';

interface ProcessInfo {
  pid: number;
  name: string;
  workingSet: number;
  privateBytes: number;
}

const MemoryTab: React.FC = () => {
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null);
  const [processList, setProcessList] = useState<ProcessInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    // Initial fetch
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
    <div className="space-y-4">
      {/* RAM Gauge */}
      <Card>
        <CardHeader>
          <CardTitle>RAM Usage</CardTitle>
        </CardHeader>
        <CardContent>
          {memoryInfo && (
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
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
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="16"
                    fill="#1f2937"
                  >
                    {memoryInfo.usedPercentage}%
                  </text>
                </svg>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  {formatBytes(memoryInfo.usedBytes)} / {formatBytes(memoryInfo.totalBytes)} used
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Page File Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Page File</CardTitle>
        </CardHeader>
        <CardContent>
          {memoryInfo && (
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${(memoryInfo.usedBytes / memoryInfo.totalBytes) * 100}%` }}
              ></div>
              <div className="mt-2 text-center text-sm">
                {/* Placeholder: detailed page file info not available on all platforms */}
                {formatBytes(memoryInfo.usedBytes)} / {formatBytes(memoryInfo.totalBytes)} used
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Process Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Processes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input placeholder="Search processes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('name')}>
                    Name{renderSortArrow('name')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('workingSet')}>
                    Working Set{renderSortArrow('workingSet')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('privateBytes')}>
                    Private Bytes{renderSortArrow('privateBytes')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.map(p => (
                  <TableRow key={p.pid}>
                    <TableCell>{p.name}</TableCell>
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