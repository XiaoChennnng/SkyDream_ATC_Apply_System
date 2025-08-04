import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'applicant' | 'teacher' | 'admin' | Array<'applicant' | 'teacher' | 'admin'>;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  // 如果用户未登录，重定向到登录页面
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 如果指定了所需角色，检查用户是否有该角色
  if (requiredRole) {
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(user.role)
      : user.role === requiredRole;
    
    if (!hasRequiredRole) {
      // 如果用户没有所需角色，重定向到首页
      return <Navigate to="/" replace />;
    }
  }

  // 用户已登录且有所需角色，渲染子组件
  return <>{children}</>;
}