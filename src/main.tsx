import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 添加调试信息
console.log('开始渲染应用...');
console.log('查找根元素:', document.getElementById('root'));

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