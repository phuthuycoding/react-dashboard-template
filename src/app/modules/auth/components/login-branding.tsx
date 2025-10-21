import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import Logo from '@/assets/react.svg';

export const LoginBranding: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <img src={Logo} alt="Logo" className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              React Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">Template</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            Modern Dashboard
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Solution
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            A comprehensive management system with modern UI components. Monitor, control, and optimize your operations.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <BarChart3 className="w-8 h-8 text-emerald-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Analytics</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <TrendingUp className="w-8 h-8 text-teal-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Performance</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Activity className="w-8 h-8 text-cyan-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Real-time</span>
          </div>
        </div>
      </div>
    </div>
  );
};
