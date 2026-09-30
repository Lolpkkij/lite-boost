import { Settings, Bell, RefreshCcw, Target, Activity, Monitor, Shield, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Switch } from '@components/ui/switch';
import { cn } from '@lib/utils';

export function SettingsTab() {
  const [trimEnabled, setTrimEnabled] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [minResize, setMinResize] = useState(false);
  const [startWithSystem, setStartWithSystem] = useState(true);
  const [notifications, setNotifications] = useState(false);

  return (
    <div className="flex size-full flex-col gap-4 p-6">
      <Card className="border-gray-800 bg-gradient-to-r from-blue-900/10 to-purple-900/10 shadow-lg shadow-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-5 text-blue-400" />
            Settings
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure LiteBoost preferences and options
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {/* Memory Settings */}
        <Card className="border-gray-800 bg-[#15152b] shadow-lg shadow-black/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-4 text-blue-400" />
              Memory Monitoring
            </CardTitle>
            <CardDescription>Configure memory trimming and refresh options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Enable Memory Trimming</p>
                <p className="text-xs text-gray-500">Automatically clean unused memory</p>
              </div>
              <Switch
                checked={trimEnabled}
                onCheckedChange={setTrimEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Auto Refresh Rates</p>
                <p className="text-xs text-gray-500">Update metrics automatically</p>
              </div>
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Refresh Interval</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={autoRefresh ? 'default' : 'outline'}
                  size="sm"
                  className={autoRefresh ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}
                >
                  1s
                </Button>
                <Button
                  variant={autoRefresh ? 'default' : 'outline'}
                  size="sm"
                  className={autoRefresh ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}
                >
                  2s
                </Button>
                <Button
                  variant={autoRefresh ? 'default' : 'outline'}
                  size="sm"
                  className={autoRefresh ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}
                >
                  5s
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="border-gray-800 bg-[#15152b] shadow-lg shadow-black/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="size-4 text-purple-400" />
              Display & Window
            </CardTitle>
            <CardDescription>Window behavior and appearance options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Minimize Window on Close</p>
                <p className="text-xs text-gray-500">Hide instead of exiting the app</p>
              </div>
              <Switch
                checked={minResize}
                onCheckedChange={setMinResize}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Hardware Acceleration</p>
                <p className="text-xs text-gray-500">Enable GPU acceleration for rendering</p>
              </div>
              <Switch
                checked={!minResize}
                disabled
                onCheckedChange={(checked) => setMinResize(!checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="border-gray-800 bg-[#15152b] shadow-lg shadow-black/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-4 text-green-400" />
              System Integration
            </CardTitle>
            <CardDescription>Startup and notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Start with System</p>
                <p className="text-xs text-gray-500">Launch LiteBoost on startup</p>
              </div>
              <Switch
                checked={startWithSystem}
                onCheckedChange={setStartWithSystem}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Low-Usage Notifications</p>
                <p className="text-xs text-gray-500">Alert when load drops below threshold</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="border-gray-800 bg-[#15152b] shadow-lg shadow-black/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCcw className="size-4 text-orange-400" />
              Actions
            </CardTitle>
            <CardDescription>Perform system actions and reset settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full gap-2 border-red-800 text-red-400 hover:bg-red-900/20"
            >
              <RefreshCcw className="size-4" />
              Reset All Settings
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2 border-gray-700 text-gray-400 hover:bg-gray-800"
            >
              <X className="size-4" />
              Shutdown LiteBoost
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}