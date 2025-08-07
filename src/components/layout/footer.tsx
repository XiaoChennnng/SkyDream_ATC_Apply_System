import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-8 px-6 w-full">
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="Skydream Logo" className="h-8 mr-2" />
              <h3 className="text-lg font-bold">Skydream管制员系统</h3>
            </div>
            <p className="text-sm text-primary-foreground/80">
              专业的管制员培训平台，从申请到考核，一站式管理您的管制员生涯
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white/80">首页</Link></li>
              <li><Link to="/application" className="hover:text-white/80">申请管理</Link></li>
              <li><Link to="/exams" className="hover:text-white/80">考试预约</Link></li>
              <li><Link to="/activities" className="hover:text-white/80">活动考核</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">资源中心</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/resources" className="hover:text-white/80">管制手册</Link></li>
              <li><Link to="/resources" className="hover:text-white/80">培训材料</Link></li>
              <li><Link to="/resources" className="hover:text-white/80">常见问题</Link></li>
              <li><Link to="/resources" className="hover:text-white/80">联系我们</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">联系我们</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="mr-2">📧</span>
                <a href="mailto:contact@skydream.com" className="hover:text-white/80">contact@skydream.com</a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">🌐</span>
                <a href="https://www.skydream.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/80">www.skydream.com</a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">💬</span>
                <span>QQ群: 123456789</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-primary-foreground/70">
          <p>© {new Date().getFullYear()} Skydream管制员申请及管理系统. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
}