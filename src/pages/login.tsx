import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

interface LocationState {
  from?: string;
}

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 将用户名转换为大写，因为系统存储的是大写的callsign
      console.log('尝试登录:', username.toUpperCase(), password);
      const success = await login(username.toUpperCase(), password);
      console.log('登录结果:', success);
      
      if (success) {
        // 登录成功，重定向到之前尝试访问的页面
        navigate(from, { replace: true });
      } else {
        setError('用户名或密码错误，请重试');
      }
    } catch (err) {
      setError('登录过程中发生错误，请稍后再试');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Skydream Logo" className="h-20" />
          </div>
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>
            登录您的Skydream账户以访问管制员申请和管理功能
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                用户名/呼号/邮箱
              </label>
              <Input 
                id="username"
                placeholder="请输入您的用户名、呼号或邮箱" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  密码
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  忘记密码?
                </Link>
              </div>
              <Input 
                id="password"
                type="password" 
                placeholder="请输入您的密码" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登录中...
                </>
              ) : '登录'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            还没有账户? {' '}
            <Link to="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}