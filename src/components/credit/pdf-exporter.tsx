import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CreditReport } from '@/services/credit-api';
import React from 'react';
import ReactDOM from 'react-dom';

// 创建一个临时的React组件来渲染PDF内容
const PdfTemplate = ({ report, formatDate }: { report: CreditReport, formatDate: (dateString: string) => string }) => {
  return (
    <div id="pdf-content" style={{ width: '210mm', padding: '10mm', fontFamily: 'Arial, "Microsoft YaHei", sans-serif' }}>
      {/* Logo和标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Skydream 征信报告 - {report.user.callsign}</h1>
        <img src="/logo.svg" alt="Skydream Logo" style={{ height: '60px' }} />
      </div>
      
      {/* 用户信息 */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>用户信息</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <p><strong>呼号:</strong> {report.user.callsign}</p>
          <p><strong>姓名:</strong> {report.user.name}</p>
          <p><strong>邮箱:</strong> {report.user.email}</p>
          <p><strong>QQ:</strong> {report.user.qq || '未提供'}</p>
          <p><strong>电话:</strong> {report.user.phone || '未提供'}</p>
          <p><strong>权限:</strong> {report.user.permissions.join(', ') || '无'}</p>
          <p><strong>注册时间:</strong> {formatDate(report.user.createdAt)}</p>
        </div>
      </div>
      
      {/* 评分摘要 */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>评分摘要</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <p><strong>可靠性评分:</strong> {report.summary.reliability}</p>
          <p><strong>活跃度评分:</strong> {report.summary.activityLevel}</p>
          <p><strong>成功率评分:</strong> {report.summary.successRate}</p>
          <p><strong>综合评分:</strong> {report.summary.overallScore}</p>
        </div>
      </div>
      
      {/* 申请记录 */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>申请记录</h2>
        <div style={{ marginBottom: '10px' }}>
          <p><strong>总申请数:</strong> {report.applications.total} | 
             <strong> 已批准:</strong> {report.applications.approved} | 
             <strong> 已拒绝:</strong> {report.applications.rejected} | 
             <strong> 待处理:</strong> {report.applications.pending}</p>
        </div>
        
        {report.applications.records.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#0a2463', color: 'white' }}>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>申请类型</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>状态</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>日期</th>
              </tr>
            </thead>
            <tbody>
              {report.applications.records.map((record, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{record.details.type}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {record.status === 'approved' ? '已批准' : record.status === 'rejected' ? '已拒绝' : '待处理'}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatDate(record.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* 考试记录 */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>考试记录</h2>
        <div style={{ marginBottom: '10px' }}>
          <p><strong>总考试数:</strong> {report.exams.total} | 
             <strong> 通过:</strong> {report.exams.passed} | 
             <strong> 未通过:</strong> {report.exams.failed} | 
             <strong> 待完成:</strong> {report.exams.pending}</p>
        </div>
        
        {report.exams.records.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#0a2463', color: 'white' }}>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>考试类型</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>状态</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>结果</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>日期</th>
              </tr>
            </thead>
            <tbody>
              {report.exams.records.map((record, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {record.details.examType === 'theory' ? '理论考试' : '实操考试'}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {record.status === 'completed' ? '已完成' : record.status === 'confirmed' ? '已确认' : '待确认'}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {record.result === 'pass' ? '通过' : record.result === 'fail' ? '未通过' : '未评分'}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatDate(record.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* 活动记录 */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>活动记录</h2>
        <div style={{ marginBottom: '10px' }}>
          <p><strong>总活动数:</strong> {report.activities.total} | 
             <strong> 通过:</strong> {report.activities.passed} | 
             <strong> 未通过:</strong> {report.activities.failed} | 
             <strong> 待完成:</strong> {report.activities.pending}</p>
        </div>
        
        {report.activities.records.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#0a2463', color: 'white' }}>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>管制席位</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>状态</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>结果</th>
                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>日期</th>
              </tr>
            </thead>
            <tbody>
              {report.activities.records.map((record, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{record.details.activityCallsign}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {record.status === 'completed' ? '已完成' : record.status === 'confirmed' ? '已确认' : '待确认'}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {record.result === 'pass' ? '通过' : record.result === 'fail' ? '未通过' : '未评分'}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatDate(record.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* 页脚 */}
      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '10px', fontSize: '10px', color: '#666' }}>
        Skydream 征信报告 - 生成日期: {new Date().toLocaleDateString('zh-CN')}
      </div>
    </div>
  );
};

export async function exportReportToPdf(report: CreditReport, formatDate: (dateString: string) => string) {
  // 创建一个临时容器来渲染PDF内容
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);
  
  // 渲染PDF模板到临时容器
  ReactDOM.render(<PdfTemplate report={report} formatDate={formatDate} />, container);
  
  try {
    // 等待图片加载完成
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 使用html2canvas将内容转换为图像
    const canvas = await html2canvas(container, {
      scale: 2, // 提高清晰度
      useCORS: true, // 允许跨域图片
      logging: false
    });
    
    // 创建PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // 计算宽高比
    const imgWidth = 210; // A4宽度，单位mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // 添加图像到PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // 如果内容超过一页，添加更多页面
    if (imgHeight > 297) { // A4高度是297mm
      let heightLeft = imgHeight - 297;
      let position = -297;
      
      while (heightLeft > 0) {
        position -= 297;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }
    }
    
    // 保存PDF
    pdf.save(`skydream_credit_report_${report.user.callsign}.pdf`);
  } catch (error) {
    console.error('导出PDF失败:', error);
    alert('导出PDF失败，请稍后再试');
  } finally {
    // 清理临时容器
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  }
}