import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadService } from './services/preload-service'
import { fileSystem } from './services/file-system'

// 添加调试信息
console.log('开始渲染应用...');
console.log('查找根元素:', document.getElementById('root'));

// 初始化服务
const initializeServices = async () => {
  try {
    console.log('初始化文件系统...');
    await fileSystem.initialize();
    console.log('文件系统初始化完成');
    
    console.log('初始化预加载服务...');
    await preloadService.initialize();
    console.log('预加载服务初始化完成');
  } catch (error) {
    console.error('服务初始化失败:', error);
  }
};

// 启动服务初始化
initializeServices();

try {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  console.log('创建根元素成功');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('渲染完成');
} catch (error) {
  console.error('渲染过程中出错:', error);
}
