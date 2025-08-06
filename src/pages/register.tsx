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

      // 检查呼号是否已存在
      let existingUser = null;
      try {
        existingUser = await userApi.getByCallsign(formData.callsign);
      } catch (error) {
        // 如果是因为用户不存在而导致的错误，可以忽略
        console.log('检查呼号时出错，可能是新用户');
      }
      
      if (existingUser) {
        setError('该呼号已被注册');
        setIsSubmitting(false);
        return;
      }

      // 检查邮箱是否已存在
      let allUsers = [];
      try {
        allUsers = await userApi.getAll();
      } catch (error) {
        console.log('检查邮箱时出错，继续注册流程');
      }
      
      const existingEmail = allUsers.find(user => user.email === formData.email);
      if (existingEmail) {
        setError('该邮箱已被注册');
        setIsSubmitting(false);
        return;
      }

      // 创建用户
      try {
        await userApi.create({
          callsign: formData.callsign,
          name: formData.name || formData.callsign, // 如果没有提供姓名，使用呼号作为姓名
          email: formData.email,
          qq: formData.qq,
          password: formData.password,
          role: 'applicant',
          permissions: [],
          status: 'active'
        });
        
        // 注册成功，跳转到登录页面
        alert('注册成功，请登录');
        navigate('/login');
        return; // 成功后直接返回，不执行后续代码
      } catch (error: any) {
        // 检查是否是因为用户已存在的错误
        if (error.message && error.message.includes('呼号已存在')) {
          // 用户已经成功创建，但返回了错误
          alert('注册成功，请登录');
          navigate('/login');
          return; // 成功后直接返回，不执行后续代码
        } else {
          console.error('注册失败:', error);
          
          // 尝试检查用户是否已经创建成功
          try {
            const newUser = await userApi.getByCallsign(formData.callsign);
            if (newUser) {
              // 用户已经创建成功，但后续操作出错
              alert('注册成功，请登录');
              navigate('/login');
              return;
            }
          } catch (checkError) {
            console.log('检查用户是否创建成功时出错', checkError);
          }
          
          setError('注册过程中发生错误，请稍后再试');
          setIsSubmitting(false);
          return; // 出错后直接返回，不执行后续代码
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