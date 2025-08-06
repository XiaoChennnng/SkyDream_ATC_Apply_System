import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userApi } from '@/services/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    callsign: '',
    name: '',
    email: '',
    qq: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 验证表单
      if (formData.password !== formData.confirmPassword) {
        setError('两次输入的密码不一致');
        setIsSubmitting(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('密码长度至少为6位');
        setIsSubmitting(false);
        return;
      }

      console.log('开始注册流程，用户数据:', {
        callsign: formData.callsign,
        name: formData.name,
        email: formData.email,
        qq: formData.qq
      });

      // 创建用户
      try {
        const newUser = await userApi.create({
          callsign: formData.callsign.toUpperCase(), // 统一转换为大写
          name: formData.name || formData.callsign, 
          email: formData.email,
          qq: formData.qq,
          password: formData.password,
          role: 'applicant',
          permissions: [],
          status: 'active'
        });
        
        console.log('用户创建成功:', newUser);
        
        // 注册成功，跳转到登录页面
        alert('注册成功！请使用您的呼号和密码登录。');
        navigate('/login');
        
      } catch (error: any) {
        console.error('注册失败，详细错误:', error);
        
        // 处理不同类型的错误
        if (error.message) {
          if (error.message.includes('呼号已存在')) {
            setError('该呼号已被注册，请使用其他呼号');
          } else if (error.message.includes('邮箱')) {
            setError('该邮箱已被注册，请使用其他邮箱');
          } else {
            setError(`注册失败: ${error.message}`);
          }
        } else if (error.response?.data?.error) {
          setError(`注册失败: ${error.response.data.error}`);
        } else {
          setError('注册过程中发生网络错误，请检查网络连接后重试');
        }
      }
    } catch (err) {
      // 这里的错误处理已经在内部 try-catch 中处理了，不需要重复处理
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">注册账户</CardTitle>
          <CardDescription>
            创建您的Skydream管制员系统账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="callsign">呼号</Label>
              <Input 
                id="callsign"
                name="callsign"
                placeholder="请输入您的呼号（如1234）" 
                value={formData.callsign}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                请输入您的Skydream呼号（通常为4位数字）
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input 
                id="name"
                name="name"
                placeholder="请输入您的姓名（选填）" 
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">电子邮箱</Label>
              <Input 
                id="email"
                name="email"
                type="email" 
                placeholder="请输入您的电子邮箱" 
                value={formData.email}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                用于接收系统通知和重置密码
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qq">QQ号码</Label>
              <Input 
                id="qq"
                name="qq"
                placeholder="请输入您的QQ号码" 
                value={formData.qq}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                用于联系和通知
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input 
                id="password"
                name="password"
                type="password" 
                placeholder="请设置密码" 
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                密码长度至少为6位
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input 
                id="confirmPassword"
                name="confirmPassword"
                type="password" 
                placeholder="请再次输入密码" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="agreeTerms" 
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="agreeTerms" className="text-sm text-muted-foreground">
                我已阅读并同意 <Link to="/terms" className="text-primary hover:underline">服务条款</Link> 和 <Link to="/privacy" className="text-primary hover:underline">隐私政策</Link>
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!formData.agreeTerms || isSubmitting}
            >
              {isSubmitting ? '注册中...' : '注册'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            已有账号? {' '}
            <Link to="/login" className="text-primary hover:underline">
              立即登录
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}