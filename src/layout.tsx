import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { 
  FileText, 
  BookOpen, 
  Activity, 
  ClipboardCheck, 
  Users, 
  LogOut, 
  User, 
  Settings,
  Database,
  Shield
} from 'lucide-react';

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Skydream Logo" className="h-8" />
            <h1 className="text-xl font-bold">Skydream管制员系统</h1>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                欢迎，{user.callsign} ({user.role === 'admin' ? '管理员' : user.role === 'teacher' ? '教员' : '申请者'})
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                退出
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">登录</Link>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link to="/register">注册</Link>
              </Button>
            </div>
          )}
        </div>
      </header>
      
      <div className="flex-1 flex">
        {user && (
          <aside className="w-64 bg-muted/30 border-r p-4">
            <nav className="space-y-1">
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${isActive('/') ? 'bg-muted' : ''}`}
                asChild
              >
                <Link to="/">
                  <User className="h-4 w-4 mr-2" />
                  个人主页
                </Link>
              </Button>
              
              {user.role === 'applicant' && (
                <>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${isActive('/application') ? 'bg-muted' : ''}`}
                    asChild
                  >
                    <Link to="/application">
                      <FileText className="h-4 w-4 mr-2" />
                      申请管理
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${isActive('/exam') ? 'bg-muted' : ''}`}
                    asChild
                  >
                    <Link to="/exam">
                      <BookOpen className="h-4 w-4 mr-2" />
                      考试预约
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${isActive('/activity') ? 'bg-muted' : ''}`}
                    asChild
                  >
                    <Link to="/activity">
                      <Activity className="h-4 w-4 mr-2" />
                      活动考核
                    </Link>
                  </Button>
                </>
              )}
              
              {(user.role === 'teacher' || user.role === 'admin') && (
                <>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${isActive('/applications-review') ? 'bg-muted' : ''}`}
                    asChild
                  >
                    <Link to="/applications-review">
                      <ClipboardCheck className="h-4 w-4 mr-2" />
                      申请审核
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${isActive('/exams-management') ? 'bg-muted' : ''}`}
                    asChild
                  >
                    <Link to="/exams-management">
                      <BookOpen className="h-4 w-4 mr-2" />
                      考试管理
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${isActive('/activities-management') ? 'bg-muted' : ''}`}
                    asChild
                  >
                    <Link to="/activities-management">
                      <Activity className="h-4 w-4 mr-2" />
                      活动管理
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${isActive('/credit-system') ? 'bg-muted' : ''}`}
                    asChild
                  >
                    <Link to="/credit-system">
                      <Database className="h-4 w-4 mr-2" />
                      征信系统
                    </Link>
                  </Button>
                </>
              )}
              
              {user.role === 'admin' && (
                <>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${isActive('/account-management') ? 'bg-muted' : ''}`}
                    asChild
                  >
                    <Link to="/account-management">
                      <Users className="h-4 w-4 mr-2" />
                      账号管理
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${isActive('/system-management') ? 'bg-muted' : ''}`}
                    asChild
                  >
                    <Link to="/system-management">
                      <Shield className="h-4 w-4 mr-2" />
                      系统管理
                    </Link>
                  </Button>
                </>
              )}
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </Button>
            </nav>
          </aside>
        )}
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      <footer className="bg-muted/30 border-t py-4 px-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Skydream管制员系统 - 版权所有
        </div>
      </footer>
    </div>
  );
}