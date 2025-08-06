 import { CreditReport } from '@/services/credit-api';
import React from 'react';
import { createRoot } from 'react-dom/client';

// 创建HTML模板组件
const HtmlTemplate = ({ report, formatDate }: { report: CreditReport, formatDate: (dateString: string) => string }) => {
  return (
    <div style={{ fontFamily: 'Arial, "Microsoft YaHei", sans-serif', margin: '0', padding: '0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        {/* Logo和标题 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', margin: '0' }}>Skydream 征信报告 - {report.user.callsign}</h1>
          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPCEtLSDog4zmma/lnIblvaIgLS0+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5MCIgZmlsbD0iIzBhMjQ2MyIgLz4KICAKICA8IS0tIOmTvuacuuWbviAtLT4KICA8cGF0aCBkPSJNMTYwLDEwMCBDMTYwLDcwIDEzMCw1MCAxMDAsNTAgQzcwLDUwIDQwLDcwIDQwLDEwMCBDNDAsMTMwIDcwLDE1MCAxMDAsMTUwIEMxMzAsMTUwIDE2MCwxMzAgMTYwLDEwMCBaIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjEiIC8+CiAgCiAgPCEtLSDlrZfmr40gUyAtLT4KICA8cGF0aCBkPSJNODAsNzAgQzkwLDY1IDExMCw2NSAxMjAsNzAgQzEzMCw3NSAxMzAsODUgMTIwLDkwIEMxMTAsOTUgOTAsOTUgODAsOTAgQzcwLDg1IDcwLDc1IDgwLDcwIFoiIGZpbGw9IiNmZmZmZmYiIC8+CiAgPHBhdGggZD0iTTgwLDExMCBDOTAsMTA1IDExMCwxMDUgMTIwLDExMCBDMTMwLDExNSAxMzAsMTI1IDEyMCwxMzAgQzExMCwxMzUgOTAsMTM1IDgwLDEzMCBDNzAsMTI1IDcwLDExNSA4MCwxMTAgWiIgZmlsbD0iI2ZmZmZmZiIgLz4KICA8cGF0aCBkPSJNMTIwLDkwIEwxMjAsMTEwIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMTAiIC8+CiAgCiAgPCEtLSDpo57mnLrova/ovr4gLS0+CiAgPHBhdGggZD0iTTMwLDEyMCBRMTAwLDYwIDE3MCwxMjAiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiIC8+CiAgCiAgPCEtLSDmlofmnKwgLS0+CiAgPHRleHQgeD0iMTAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9ImJvbGQiPlNLWURSRUFNPC90ZXh0Pgo8L3N2Zz4=" alt="Skydream Logo" style={{ height: '60px' }} />
        </div>
        
      {/* 用户信息 */}
      <div style={{ marginBottom: '15px' }}>
        <h2 style={{ fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px' }}>用户信息</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px', fontSize: '12px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd', width: '25%' }}><strong>呼号</strong></td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd', width: '25%' }}>{report.user.callsign}</td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd', width: '25%' }}><strong>姓名</strong></td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd', width: '25%' }}>{report.user.name}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}><strong>邮箱</strong></td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{report.user.email}</td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}><strong>QQ</strong></td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{report.user.qq || '未提供'}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}><strong>电话</strong></td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{report.user.phone || '未提供'}</td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}><strong>注册时间</strong></td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{formatDate(report.user.createdAt)}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}><strong>权限</strong></td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }} colSpan={3}>{report.user.permissions.join(', ') || '无'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* 评分摘要 */}
      <div style={{ marginBottom: '15px' }}>
        <h2 style={{ fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px' }}>评分摘要</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px', fontSize: '12px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd', width: '25%' }}><strong>可靠性评分</strong></td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd', width: '25%' }}>{report.summary.reliability}</td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd', width: '25%' }}><strong>活跃度评分</strong></td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd', width: '25%' }}>{report.summary.activityLevel}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}><strong>成功率评分</strong></td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{report.summary.successRate}</td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}><strong>违规影响评分</strong></td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{report.summary.violationImpact}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}><strong>综合评分</strong></td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }} colSpan={3}>{report.summary.overallScore}</td>
            </tr>
          </tbody>
        </table>
      </div>
        
        {/* 申请记录 */}
        <div style={{ marginBottom: '15px' }}>
          <h2 style={{ fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px' }}>申请记录</h2>
          <div style={{ marginBottom: '5px', fontSize: '12px' }}>
            <p>
              <strong>总申请数:</strong> {report.applications.total} | 
              <strong> 已批准:</strong> {report.applications.approved} | 
              <strong> 已拒绝:</strong> {report.applications.rejected} | 
              <strong> 待处理:</strong> {report.applications.pending}
            </p>
          </div>
          
          {report.applications.records.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0a2463', color: 'white' }}>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>申请类型</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>状态</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>申请日期</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>处理日期</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>处理人</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>教员评价</th>
                </tr>
              </thead>
              <tbody>
                {report.applications.records.map((record, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{record.details.type}</td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>
                      {record.status === 'approved' ? '已批准' : record.status === 'rejected' ? '已拒绝' : '待处理'}
                    </td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{formatDate(record.date)}</td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>
                      {record.status !== 'pending' 
                        ? formatDate(record.status === 'approved' 
                            ? record.details.approvedAt 
                            : record.details.rejectedAt) 
                        : '-'}
                    </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{record.details.teacherCallsign || '-'}</td>
                      <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{record.details.comment || '-'}</td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* 考试记录 */}
        <div style={{ marginBottom: '15px' }}>
          <h2 style={{ fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px' }}>考试记录</h2>
          <div style={{ marginBottom: '5px', fontSize: '12px' }}>
            <p>
              <strong>总考试数:</strong> {report.exams.total} | 
              <strong> 通过:</strong> {report.exams.passed} | 
              <strong> 未通过:</strong> {report.exams.failed} | 
              <strong> 待完成:</strong> {report.exams.pending}
            </p>
          </div>
          
          {report.exams.records.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0a2463', color: 'white' }}>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>考试类型</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>状态</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>结果</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>分数</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>申请日期</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>考试日期</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>监考人</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>教员评价</th>
                </tr>
              </thead>
              <tbody>
                {report.exams.records.map((record, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>
                      {record.details.examType === 'theory' ? '理论考试' : '实操考试'}
                    </td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>
                      {record.status === 'completed' ? '已完成' : record.status === 'confirmed' ? '已确认' : '待确认'}
                    </td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>
                      {record.result === 'pass' ? '通过' : record.result === 'fail' ? '未通过' : '未评分'}
                    </td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{record.details.score || '-'}</td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{formatDate(record.date)}</td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>
                      {record.status !== 'pending' 
                        ? formatDate(record.details.examDate || record.details.preferredDate) 
                        : formatDate(record.details.preferredDate)}
                    </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{record.details.teacherCallsign || '-'}</td>
                      <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{record.details.comment || '-'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* 活动记录 */}
        <div style={{ marginBottom: '15px' }}>
          <h2 style={{ fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px' }}>活动记录</h2>
          <div style={{ marginBottom: '5px', fontSize: '12px' }}>
            <p>
              <strong>总活动数:</strong> {report.activities.total} | 
              <strong> 通过:</strong> {report.activities.passed} | 
              <strong> 未通过:</strong> {report.activities.failed} | 
              <strong> 待完成:</strong> {report.activities.pending}
            </p>
          </div>
          
          {report.activities.records.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0a2463', color: 'white' }}>
                  <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>管制席位</th>
                  <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>状态</th>
                  <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>结果</th>
                  <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>获得权限</th>
                  <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>申请日期</th>
                  <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>活动日期</th>
                  <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>负责教员</th>
                  <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>教员评价</th>
                </tr>
              </thead>
              <tbody>
                {report.activities.records.map((record, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{record.details.activityCallsign}</td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>
                      {record.status === 'completed' ? '已完成' : record.status === 'confirmed' ? '已确认' : '待确认'}
                    </td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>
                      {record.result === 'pass' ? '通过' : record.result === 'fail' ? '未通过' : '未评分'}
                    </td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>
                      {record.details.permission ? record.details.permission : '-'}
                    </td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{formatDate(record.date)}</td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>
                      {record.status !== 'pending' 
                        ? formatDate(record.details.activityDate || record.details.preferredDate) 
                        : formatDate(record.details.preferredDate)}
                    </td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{record.details.teacherCallsign || '-'}</td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{record.details.comment || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* 违规记录 */}
        <div style={{ marginBottom: '15px' }}>
          <h2 style={{ fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '8px' }}>违规记录</h2>
          <div style={{ marginBottom: '5px', fontSize: '12px' }}>
            <p>
              <strong>总违规数:</strong> {report.violations.total} | 
              <strong> 轻微:</strong> {report.violations.minor} | 
              <strong> 中度:</strong> {report.violations.moderate} | 
              <strong> 严重:</strong> {report.violations.severe}
            </p>
          </div>
          
          {report.violations.records.length > 0 ? (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0a2463', color: 'white' }}>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>违规标题</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>严重程度</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>报告人</th>
                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ddd' }}>日期</th>
                  </tr>
                </thead>
                <tbody>
                  {report.violations.records.map((record, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{record.title}</td>
                      <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>
                        {record.severity === 'minor' ? '轻微' : record.severity === 'moderate' ? '中度' : '严重'}
                      </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{record.reportedBy} ({record.reporterCallsign})</td>
                      <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{formatDate(record.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div style={{ marginTop: '10px', fontSize: '12px' }}>
                {report.violations.records.map((record, index) => (
                  <div key={index} style={{ 
                    marginTop: '8px', 
                    padding: '6px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px', 
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' 
                  }}>
                    <h3 style={{ marginTop: 0, fontSize: '14px', marginBottom: '4px' }}>{record.title}</h3>
                    <p style={{ marginBottom: '3px' }}>
                      <strong>严重程度:</strong> 
                      <span style={{ 
                        padding: '1px 4px', 
                        borderRadius: '8px', 
                        fontSize: '11px', 
                        backgroundColor: record.severity === 'minor' ? '#fff3cd' : record.severity === 'moderate' ? '#ffe5d0' : '#ffcccc',
                        color: record.severity === 'minor' ? '#856404' : record.severity === 'moderate' ? '#ad6200' : '#721c24'
                      }}>
                        {record.severity === 'minor' ? '轻微' : record.severity === 'moderate' ? '中度' : '严重'}
                      </span>
                    </p>
                    <p style={{ marginBottom: '3px' }}><strong>报告人:</strong> {record.reportedBy} ({record.reporterCallsign})</p>
                    <p style={{ marginBottom: '3px' }}><strong>日期:</strong> {formatDate(record.date)}</p>
                    <div style={{ marginTop: '6px', padding: '6px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                      <p style={{ margin: 0 }}>{record.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <p style={{ fontSize: '12px' }}>暂无违规记录</p>
            </div>
          )}
        </div>
        
        {/* 页脚 */}
        <div style={{ marginTop: '15px', borderTop: '1px solid #ccc', paddingTop: '5px', fontSize: '10px', color: '#666' }}>
          Skydream 征信报告 - 生成日期: {new Date().toLocaleDateString('zh-CN')}
        </div>
      </div>
    </div>
  );
};

// 导出HTML报告函数
export function exportReportToHtml(report: CreditReport, formatDate: (dateString: string) => string) {
  try {
    // 创建完整的HTML内容
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Skydream 征信报告 - ${report.user.callsign}</title>
        <style>
          body {
            font-family: Arial, "Microsoft YaHei", sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .header h1 {
            font-size: 24px;
            margin: 0;
          }
          .header img {
            height: 60px;
          }
          .section {
            margin-bottom: 15px;
          }
          .section h2 {
            font-size: 16px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 3px;
            margin-bottom: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
            font-size: 12px;
          }
          th {
            background-color: #0a2463;
            color: white;
            padding: 4px 6px;
            text-align: left;
            border: 1px solid #ddd;
          }
          td {
            padding: 4px 6px;
            border: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .footer {
            margin-top: 15px;
            border-top: 1px solid #ccc;
            padding-top: 5px;
            font-size: 10px;
            color: #666;
          }
          @media print {
            body {
              background-color: #fff;
            }
            .container {
              box-shadow: none;
              margin: 0;
              max-width: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Logo和标题 -->
          <div class="header">
            <h1>Skydream 征信报告 - ${report.user.callsign}</h1>
            <img src="${window.location.origin}/logo.png" alt="Skydream Logo">
          </div>
          
          <!-- 用户信息 -->
          <div class="section">
            <h2>用户信息</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 12px;">
              <tbody>
                <tr>
                  <td style="padding: 4px 6px; border: 1px solid #ddd; width: 25%;"><strong>呼号</strong></td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd; width: 25%;">${report.user.callsign}</td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd; width: 25%;"><strong>姓名</strong></td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd; width: 25%;">${report.user.name}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;"><strong>邮箱</strong></td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;">${report.user.email}</td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;"><strong>QQ</strong></td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;">${report.user.qq || '未提供'}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;"><strong>电话</strong></td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;">${report.user.phone || '未提供'}</td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;"><strong>注册时间</strong></td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;">${formatDate(report.user.createdAt)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;"><strong>权限</strong></td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;" colspan="3">${report.user.permissions.join(', ') || '无'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 评分摘要 -->
          <div class="section">
            <h2>评分摘要</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 12px;">
              <tbody>
                <tr>
                  <td style="padding: 4px 6px; border: 1px solid #ddd; width: 25%;"><strong>可靠性评分</strong></td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd; width: 25%;">${report.summary.reliability}</td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd; width: 25%;"><strong>活跃度评分</strong></td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd; width: 25%;">${report.summary.activityLevel}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;"><strong>成功率评分</strong></td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;">${report.summary.successRate}</td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;"><strong>违规影响评分</strong></td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;">${report.summary.violationImpact}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;"><strong>综合评分</strong></td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd;" colspan="3">${report.summary.overallScore}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 申请记录 -->
          <div class="section">
            <h2>申请记录</h2>
            <div style="font-size: 12px;">
              <p>
                <strong>总申请数:</strong> ${report.applications.total} | 
                <strong> 已批准:</strong> ${report.applications.approved} | 
                <strong> 已拒绝:</strong> ${report.applications.rejected} | 
                <strong> 待处理:</strong> ${report.applications.pending}
              </p>
            </div>
            
            ${report.applications.records.length > 0 ? `
              <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 12px;">
                <thead>
                  <tr style="background-color: #0a2463; color: white;">
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">申请类型</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">状态</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">申请日期</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">处理日期</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">处理人</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">教员评价</th>
                  </tr>
                </thead>
                <tbody>
                  ${report.applications.records.map((record, index) => `
                    <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : 'white'}">
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${record.details.type}</td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">
                        ${record.status === 'approved' ? '已批准' : record.status === 'rejected' ? '已拒绝' : '待处理'}
                      </td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${formatDate(record.date)}</td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">
                        ${record.status !== 'pending' 
                          ? formatDate(record.status === 'approved' 
                              ? record.details.approvedAt 
                              : record.details.rejectedAt) 
                          : '-'}
                      </td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${record.details.teacherCallsign || '-'}</td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${record.details.comment || '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p style="text-align: center; padding: 10px;">暂无申请记录</p>'}
          </div>
          
          <!-- 考试记录 -->
          <div class="section">
            <h2>考试记录</h2>
            <div style="font-size: 12px;">
              <p>
                <strong>总考试数:</strong> ${report.exams.total} | 
                <strong> 通过:</strong> ${report.exams.passed} | 
                <strong> 未通过:</strong> ${report.exams.failed} | 
                <strong> 待完成:</strong> ${report.exams.pending}
              </p>
            </div>
            
            ${report.exams.records.length > 0 ? `
              <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 12px;">
                <thead>
                  <tr style="background-color: #0a2463; color: white;">
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">考试类型</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">状态</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">结果</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">分数</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">申请日期</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">考试日期</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">监考人</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">教员评价</th>
                  </tr>
                </thead>
                <tbody>
                  ${report.exams.records.map((record, index) => `
                    <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : 'white'}">
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">
                        ${record.details.examType === 'theory' ? '理论考试' : '实操考试'}
                      </td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">
                        ${record.status === 'completed' ? '已完成' : record.status === 'confirmed' ? '已确认' : '待确认'}
                      </td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">
                        ${record.result === 'pass' ? '通过' : record.result === 'fail' ? '未通过' : '未评分'}
                      </td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${record.details.score || '-'}</td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${formatDate(record.date)}</td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">
                        ${record.status !== 'pending' 
                          ? formatDate(record.details.examDate || record.details.preferredDate) 
                          : formatDate(record.details.preferredDate)}
                      </td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${record.details.teacherCallsign || '-'}</td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${record.details.comment || '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p style="text-align: center; padding: 10px; font-size: 12px;">暂无考试记录</p>'}
          </div>
          
          <!-- 活动记录 -->
          <div class="section">
            <h2>活动记录</h2>
            <div style="font-size: 12px;">
              <p>
                <strong>总活动数:</strong> ${report.activities.total} | 
                <strong> 通过:</strong> ${report.activities.passed} | 
                <strong> 未通过:</strong> ${report.activities.failed} | 
                <strong> 待完成:</strong> ${report.activities.pending}
              </p>
            </div>
            
            ${report.activities.records.length > 0 ? `
              <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 12px;">
                <thead>
                  <tr style="background-color: #0a2463; color: white;">
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">管制席位</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">状态</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">结果</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">获得权限</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">申请日期</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">活动日期</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">负责教员</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">教员评价</th>
                  </tr>
                </thead>
                <tbody>
                  ${report.activities.records.map((record, index) => `
                    <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : 'white'}">
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${record.details.activityCallsign}</td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">
                        ${record.status === 'completed' ? '已完成' : record.status === 'confirmed' ? '已确认' : '待确认'}
                      </td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">
                        ${record.result === 'pass' ? '通过' : record.result === 'fail' ? '未通过' : '未评分'}
                      </td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">
                        ${record.details.permission ? record.details.permission : '-'}
                      </td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${formatDate(record.date)}</td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">
                        ${record.status !== 'pending' 
                          ? formatDate(record.details.activityDate || record.details.preferredDate) 
                          : formatDate(record.details.preferredDate)}
                      </td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${record.details.teacherCallsign || '-'}</td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${record.details.comment || '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p style="text-align: center; padding: 10px; font-size: 12px;">暂无活动记录</p>'}
          </div>
          
          <!-- 违规记录 -->
          <div class="section">
            <h2>违规记录</h2>
            <div style="font-size: 12px;">
              <p>
                <strong>总违规数:</strong> ${report.violations.total} | 
                <strong> 轻微:</strong> ${report.violations.minor} | 
                <strong> 中度:</strong> ${report.violations.moderate} | 
                <strong> 严重:</strong> ${report.violations.severe}
              </p>
            </div>
            
            ${report.violations.records.length > 0 ? `
              <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 12px;">
                <thead>
                  <tr style="background-color: #0a2463; color: white;">
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">违规标题</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">严重程度</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">报告人</th>
                    <th style="padding: 4px 6px; text-align: left; border: 1px solid #ddd;">日期</th>
                  </tr>
                </thead>
                <tbody>
                  ${report.violations.records.map((record, index) => `
                    <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : 'white'}">
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${record.title}</td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">
                        ${record.severity === 'minor' ? '轻微' : record.severity === 'moderate' ? '中度' : '严重'}
                      </td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${record.reportedBy} (${record.reporterCallsign})</td>
                      <td style="padding: 4px 6px; border: 1px solid #ddd;">${formatDate(record.date)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              ${report.violations.records.map((record, index) => `
                <div style="margin-top: 8px; padding: 6px; border: 1px solid #ddd; border-radius: 4px; background-color: ${index % 2 === 0 ? '#f9f9f9' : 'white'}; font-size: 12px;">
                  <h3 style="margin-top: 0; font-size: 14px; margin-bottom: 4px;">${record.title}</h3>
                  <p style="margin-bottom: 3px;"><strong>严重程度:</strong> 
                    <span style="padding: 1px 4px; border-radius: 8px; font-size: 11px; background-color: ${
                      record.severity === 'minor' ? '#fff3cd' : 
                      record.severity === 'moderate' ? '#ffe5d0' : 
                      '#ffcccc'
                    }; color: ${
                      record.severity === 'minor' ? '#856404' : 
                      record.severity === 'moderate' ? '#ad6200' : 
                      '#721c24'
                    };">
                      ${record.severity === 'minor' ? '轻微' : record.severity === 'moderate' ? '中度' : '严重'}
                    </span>
                  </p>
                  <p style="margin-bottom: 3px;"><strong>报告人:</strong> ${record.reportedBy} (${record.reporterCallsign})</p>
                  <p style="margin-bottom: 3px;"><strong>日期:</strong> ${formatDate(record.date)}</p>
                  <div style="margin-top: 6px; padding: 6px; background-color: #f0f0f0; border-radius: 4px;">
                    <p style="margin: 0;">${record.description}</p>
                  </div>
                </div>
              `).join('')}
            ` : '<p style="text-align: center; padding: 10px; font-size: 12px;">暂无违规记录</p>'}
          </div>
          
          <!-- 页脚 -->
          <div class="footer" style="margin-top: 15px; border-top: 1px solid #ccc; padding-top: 5px; font-size: 10px; color: #666;">
            Skydream 征信报告 - 生成日期: ${new Date().toLocaleDateString('zh-CN')}
          </div>
        </div>
      </body>
      </html>
    `;
    
    // 创建Blob对象
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `skydream_credit_report_${report.user.callsign}.html`;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  } catch (error) {
    console.error('导出HTML失败:', error);
    alert('导出HTML失败，请稍后再试');
  }
}
