import { jsPDF } from 'jspdf';

/**
 * 为jsPDF添加中文字体支持
 * @param doc jsPDF实例
 */
export function addFont(doc: jsPDF): void {
  try {
    // 使用系统默认字体
    doc.setFont('sans-serif');
    
    // 设置字体特性，支持中文
    (doc as any).setLanguage('zh-CN');
  } catch (error) {
    console.error('设置字体失败:', error);
  }
}