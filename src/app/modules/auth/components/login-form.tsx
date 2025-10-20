import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { useLoginViewModel } from '../viewmodels/login.viewmodel';
import { PasswordInput, LoadingButton } from './';
import Logo from '@/assets/logo_transparent.png';

export const LoginForm: React.FC = () => {
  const { form, authState, handleLogin } = useLoginViewModel();

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <img src={Logo} alt="Logo" className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Đăng nhập hệ thống
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Nhập thông tin để truy cập bảng điều khiển
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@evcharging.com"
                        type="email"
                        className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Mật khẩu</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Nhập mật khẩu của bạn"
                        className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                isLoading={authState.isLoading}
                loadingText="Đang đăng nhập...">
                <Zap className="w-4 h-4 mr-2" />
                Đăng nhập
              </LoadingButton>
            </form>
          </Form>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quên mật khẩu?
              <button className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium ml-1 hover:underline">
                Khôi phục ngay
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
