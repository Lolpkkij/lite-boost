import { Memory, RefreshCcw, Trash2, HardDrive, Activity } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Progress } from '@components/ui/progress';
import { cn } from '@lib/utils';

export function Memory() {
  const [usagePercent, setUsagePercent] = useState('--');
  const [totalMemory, setTotalMemory] = useState('--');
  const [usedMemory, setUsedMemory] = useState('--');
  const [availableMemory, setAvailableMemory] = useState('--');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTrim = () => {
    // TODO: Call trim API
    console.log('Trimming memory...');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Call memory info API
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="flex size-full flex-col gap-4 p-6">
      {/* Status Banner */}
      <Card className="border-blue-900/50 bg-gradient-to-r from-blue-900/10 to-purple-900/10 shadow-lg shadow-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5 text-blue-400" />
            Memory Overview
          </CardTitle>
          <CardDescription className="text-gray-400">
            Monitor and optimize your system memory
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Memory Usage Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Memory', value: totalMemory, icon: HardDrive, unit: 'GB', description: 'System RAM capacity' },
          { label: 'Used Memory', value: usedMemory, icon: Trash2, unit: 'GB', description: 'Memory currently in use' },
          { label: 'Available', value: availableMemory, icon: Memory, unit: 'GB', description: 'Free memory available' },
        ].map((card) => {
          const Icon = card.icon;
          const displayValue = card.value === '--' ? '0' : card.value;

          return (
            <div
              key={card.label}
              className="flex flex-col rounded-lg bg-[#15152b] p-5 shadow-lg shadow-black/50 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-700 to-gray-800`}>
                  <Icon className="size-4 text-gray-400" />
                </div>
                {card.value !== '--' && (
                  <span className="text-xs font-medium text-gray-500">{card.unit}</span>
                )}
              </div>
              <div className="mb-2">
                <span className="text-2xl font-bold text-white">
                  {displayValue}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-400">{card.label}</p>
              <p className="text-xs text-gray-600">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Main Progress Bar & Actions */}
      <Card className="border-gray-800 bg-[#15152b] shadow-lg shadow-black/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="size-5 text-blue-400" />
              Memory Usage
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isRefreshing}
                onClick={handleRefresh}
                className="gap-2 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              >
                <RefreshCcw className={cn('size-4', isRefreshing && 'animate-spin')} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTrim}
                className="gap-2 border-red-800 text-red-400 hover:bg-red-900/20"
              >
                <Trash2 className="size-4" />
                Trim
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {usagePercent === '--' ? (
            <div className="flex size-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-800">
              <p className="text-sm text-gray-500">No data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-300">
                    {usagePercent} of total memory used
                  </span>
                  <span className="text-sm text-gray-500">
                    {parseInt(usagePercent) / 100 * parseFloat(totalMemory) || 0} GB used
                  </span>
                </div>
                <Progress value={parseInt(usagePercent) || 0} className="h-3 bg-gray-800" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg bg-[#1a1a2e] p-3 border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">Memory Type</p>
                  <p className="text-sm font-medium text-gray-300">DDR4 / DDR5</p>
                </div>
                <div className="rounded-lg bg-[#1a1a2e] p-3 border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">Swap Status</p>
                  <p className="text-sm font-medium text-gray-300">Available</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-gray-800 bg-[#15152b] shadow-lg shadow-black/50">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Memory monitoring is ready</span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <Activity className="size-4" />
                Standby
              </span>
            </div>
            <p className="text-xs">
              Memory trimming is disabled until you enable it in settings or select it from the options menu.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}