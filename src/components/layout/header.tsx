import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Bell } from "lucide-react";
import { useAuth } from '@/contexts/auth-context';

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // 判断当前路径是否激活
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // 获取用户角色
  const userRole = user?.role;
  
  // 获取用户头像显示
  const getAvatarFallback = () => {
    if (!user) return '游客';
    return user.name?.charAt(0) || user.callsign.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Skydream Logo" className="h-8 mr-2" />
            <span className="text-xl font-bold">Skydream</span>
          </Link>
          
          <nav className="hidden md:flex space-x-1">
            <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>首页</Link>
            
            {/* 申请者专用导航项 */}
            {userRole === 'applicant' && (
              <>
                <Link to="/application" className={`nav-item ${isActive('/application') ? 'active' : ''}`}>申请管理</Link>
                <Link to="/exams" className={`nav-item ${isActive('/exams') ? 'active' : ''}`}>考试预约</Link>
                <Link to="/activities" className={`nav-item ${isActive('/activities') ? 'active' : ''}`}>活动考核</Link>
              </>
            )}
            
            {/* 教员和管理员专用导航项 */}
            {(userRole === 'teacher' || userRole === 'admin') && (
              <>
                <Link to="/applications-review" className={`nav-item ${isActive('/applications-review') ? 'active' : ''}`}>申请审核</Link>
                <Link to="/exams-management" className={`nav-item ${isActive('/exams-management') ? 'active' : ''}`}>考试管理</Link>
                <Link to="/activities-management" className={`nav-item ${isActive('/activities-management') ? 'active' : ''}`}>活动管理</Link>
              </>
            )}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.png" alt={user.name || user.callsign} />
                      <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || user.callsign}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>个人资料</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>账户设置</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">登录</Link>
              </Button>
              <Button asChild>
                <Link to="/register">注册</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}