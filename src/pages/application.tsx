import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { applicationApi } from '@/services/api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileInput } from '@/components/ui/file-input';

// 定义本页面使用的申请类型接口
interface Application {
  id: string;
  callsign: string;
  status: string;
  controlRoom: string;
  englishLevel: string;
  vatsimExperience: string;
  applicationReason: string;
  attachments?: string[];
  teacherCallsign?: string;
  teacherComment?: string;
  createdAt: string;
  updatedAt: string;
}

export function ApplicationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    controlRoom: '塔台' as '塔台' | '进近' | '区域' | '权限平移',
    englishLevel: '',
    vatsimExperience: '',
    applicationReason: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: string[]}>({});

  useEffect(() => {
    if (user) {
      // 使用正确的方法 getByUser 而不是 getByCallsign
      applicationApi.getByUser(user.callsign)
        .then(userApplications => {
          // 将API返回的数据转换为本页面使用的Application格式
          const formattedApplications = userApplications.map(app => ({
            id: app.id,
            callsign: user.callsign,
            status: app.status === 'pending' ? '待审核' : app.status === 'approved' ? '已通过' : '已拒绝',
            controlRoom: app.type,
            englishLevel: app.englishLevel,
            vatsimExperience: app.experience,
            applicationReason: app.reason,
            attachments: app.attachments,
            teacherCallsign: app.teacherCallsign,
            teacherComment: app.teacherComment,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt
          }));
          
          setApplications(formattedApplications);
          
          // 初始化已上传文件记录
          const filesRecord: {[key: string]: string[]} = {};
          formattedApplications.forEach(app => {
            if (app.attachments && app.attachments.length > 0) {
              filesRecord[app.id] = app.attachments;
            }
          });
          setUploadedFiles(filesRecord);
        })
        .catch(error => {
          console.error("获取申请记录失败:", error);
          setApplications([]);
        });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!user) {
        setError('请先登录');
        setIsSubmitting(false);
        return;
      }

      // 模拟文件上传，在实际应用中，这里应该调用后端API上传文件
      const fileNames = files.map(file => file.name);
      
      // 创建申请
      applicationApi.create(user.callsign, {
        type: formData.controlRoom as any,
        englishLevel: formData.englishLevel,
        experience: formData.vatsimExperience,
        reason: formData.applicationReason,
        attachments: fileNames
      }).then(newApp => {
        // 将新创建的申请转换为本页面使用的格式
        const formattedApp: Application = {
          id: newApp.id,
          callsign: user.callsign,
          status: '待审核',
          controlRoom: formData.controlRoom,
          englishLevel: formData.englishLevel,
          vatsimExperience: formData.vatsimExperience,
          applicationReason: formData.applicationReason,
          attachments: fileNames,
          createdAt: newApp.createdAt,
          updatedAt: newApp.updatedAt
        };

        // 更新申请列表
        setApplications(prev => [...prev, formattedApp]);
        
        // 更新已上传文件记录
        setUploadedFiles(prev => ({
          ...prev,
          [formattedApp.id]: fileNames
        }));

        // 重置表单
        setFormData({
          controlRoom: '塔台',
          englishLevel: '',
          vatsimExperience: '',
          applicationReason: ''
        });
        setFiles([]);

        alert('申请已提交成功！');
      }).catch(err => {
        console.error('提交申请失败:', err);
        setError('提交申请过程中发生错误，请稍后再试');
      }).finally(() => {
        setIsSubmitting(false);
      });
      
      return; // 提前返回，避免执行下面的代码
    } catch (err) {
      console.error('提交申请失败:', err);
      setError('提交申请过程中发生错误，请稍后再试');
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowDialog(true);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">管制员申请</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>提交新申请</CardTitle>
            <CardDescription>
              请填写以下信息提交您的管制员申请
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
                <Label htmlFor="controlRoom">申请管制室</Label>
                <select
                  id="controlRoom"
                  name="controlRoom"
                  value={formData.controlRoom}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="塔台">塔台</option>
                  <option value="进近">进近</option>
                  <option value="区域">区域</option>
                  <option value="权限平移">权限平移</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="englishLevel">英语水平</Label>
                <Input
                  id="englishLevel"
                  name="englishLevel"
                  placeholder="请描述您的英语水平"
                  value={formData.englishLevel}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="englishCertificate">英语水平证明（如有）</Label>
                <FileInput
                  id="englishCertificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxFiles={3}
                  onFileChange={handleFileChange}
                  description="支持PDF、JPG、PNG格式，最大5MB"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vatsimExperience">管制经验</Label>
                <textarea
                  id="vatsimExperience"
                  name="vatsimExperience"
                  placeholder="请描述您的管制经验（如有）"
                  value={formData.vatsimExperience}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceCertificate">其他平台管制经历证明（如有）</Label>
                <FileInput
                  id="experienceCertificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxFiles={3}
                  onFileChange={handleFileChange}
                  description="支持PDF、JPG、PNG格式，最大5MB"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationReason">申请理由</Label>
                <textarea
                  id="applicationReason"
                  name="applicationReason"
                  placeholder="请详细说明您申请该席位的理由"
                  value={formData.applicationReason}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md min-h-[150px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '提交申请'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>我的申请记录</CardTitle>
            <CardDescription>
              查看您已提交的申请及其状态
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                您还没有提交过申请
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="border rounded-md p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{application.controlRoom}管制员申请</h3>
                        <p className="text-sm text-muted-foreground">
                          提交时间: {new Date(application.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className={`status-badge ${
                        application.status === '待审核' ? 'status-pending' :
                        application.status === '已通过' ? 'status-approved' :
                        'status-rejected'
                      }`}>
                        {application.status}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(application)}
                      >
                        查看详情
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedApplication && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>申请详情</DialogTitle>
              <DialogDescription>
                申请ID: {selectedApplication.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">申请管制室</h4>
                  <p>{selectedApplication.controlRoom}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">申请状态</h4>
                  <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    selectedApplication.status === '待审核' ? 'bg-yellow-100 text-yellow-800' :
                    selectedApplication.status === '已通过' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedApplication.status}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium">英语水平</h4>
                <p>{selectedApplication.englishLevel}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">管制经验</h4>
                <p>{selectedApplication.vatsimExperience}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">申请理由</h4>
                <p>{selectedApplication.applicationReason}</p>
              </div>

              {uploadedFiles[selectedApplication.id] && uploadedFiles[selectedApplication.id].length > 0 && (
                <div>
                  <h4 className="text-sm font-medium">上传的附件</h4>
                  <ul className="list-disc pl-5 mt-2">
                    {uploadedFiles[selectedApplication.id].map((fileName, index) => (
                      <li key={index} className="text-sm">{fileName}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedApplication.teacherCallsign && (
                <div>
                  <h4 className="text-sm font-medium">负责教员</h4>
                  <p>{selectedApplication.teacherCallsign}</p>
                </div>
              )}

              {selectedApplication.teacherComment && (
                <div>
                  <h4 className="text-sm font-medium">教员评语</h4>
                  <p>{selectedApplication.teacherComment}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span>提交时间: </span>
                  <span>{new Date(selectedApplication.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span>最后更新: </span>
                  <span>{new Date(selectedApplication.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}