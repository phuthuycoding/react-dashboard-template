import { Zap, Car, Battery } from 'lucide-react';
import Logo from '@/assets/logo_transparent.png';

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
              SOLEV Charging Station
            </h1>
            <p className="text-sm text-muted-foreground">Management System</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            Quản lý trạm sạc
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              thông minh
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Hệ thống quản lý toàn diện cho mạng lưới trạm sạc xe điện. Theo dõi, điều khiển và tối ưu hóa hiệu suất sạc.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Car className="w-8 h-8 text-emerald-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Xe điện</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Battery className="w-8 h-8 text-teal-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pin thông minh</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Zap className="w-8 h-8 text-cyan-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sạc nhanh</span>
          </div>
        </div>
      </div>
    </div>
  );
};
