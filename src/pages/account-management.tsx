import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter, CheckCircle, User, Shield, Trash2, Key } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { userApi } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

export function AccountManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 对话框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 加载用户列表
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const allUsers = await userApi.getAll();
        // 过滤掉当前管理员自己
        const filteredUsers = allUsers.filter((u: any) => u.id !== user?.id);
        setUsers(filteredUsers);
        setFilteredUsers(filteredUsers);
      } catch (error) {
        console.error('加载用户列表失败:', error);
        toast({
          title: '错误',
          description: '加载用户列表失败',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, [user, toast]);

  // 处理搜索
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        user => 
          user.callsign.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // 设置用户为教员
  const setAsTeacher = async (userId: string) => {
    try {
      // 找到对应用户的callsign
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) {
        throw new Error('找不到指定用户');
      }
      
      // 使用callsign而不是userId
      await userApi.updateRole(userToUpdate.callsign, 'teacher');
      
      // 更新本地状态
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId ? { ...u, role: 'teacher' } : u
        )
      );
      
      // 更新筛选后的用户列表
      setFilteredUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId ? { ...u, role: 'teacher' } : u
        )
      );
      
      // 如果当前选中的用户是被修改的用户，也更新选中的用户
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: 'teacher' });
      }
      
      toast({
        title: '成功',
        description: '已将用户设置为教员',
      });
    } catch (error) {
      console.error('设置用户角色失败:', error);
      toast({
        title: '错误',
        description: '设置用户角色失败',
        variant: 'destructive',
      });
    }
  };

  // 设置用户为申请者
  const setAsApplicant = async (userId: string) => {
    try {
      // 找到对应用户的callsign
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) {
        throw new Error('找不到指定用户');
      }
      
      // 使用callsign而不是userId
      await userApi.updateRole(userToUpdate.callsign, 'applicant');
      
      // 更新本地状态
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId ? { ...u, role: 'applicant' } : u
        )
      );
      
      // 更新筛选后的用户列表
      setFilteredUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId ? { ...u, role: 'applicant' } : u
        )
      );
      
      // 如果当前选中的用户是被修改的用户，也更新选中的用户
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: 'applicant' });
      }
      
      toast({
        title: '成功',
        description: '已将用户设置为申请者',
      });
    } catch (error) {
      console.error('设置用户角色失败:', error);
      toast({
        title: '错误',
        description: '设置用户角色失败',
        variant: 'destructive',
      });
    }
  };
  
  // 删除用户
  const deleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await userApi.delete(selectedUser.callsign);
      
      // 更新本地状态
      setUsers(prevUsers => prevUsers.filter(u => u.id !== selectedUser.id));
      setFilteredUsers(prevUsers => prevUsers.filter(u => u.id !== selectedUser.id));
      setSelectedUser(null);
      
      // 关闭对话框
      setDeleteDialogOpen(false);
      
      toast({
        title: '成功',
        description: '用户已删除',
      });
    } catch (error) {
      console.error('删除用户失败:', error);
      toast({
        title: '错误',
        description: '删除用户失败',
        variant: 'destructive',
      });
    }
  };
  
  // 修改用户密码
  const changeUserPassword = async () => {
    if (!selectedUser) return;
    
    // 验证密码
    if (newPassword.length < 6) {
      setPasswordError('密码长度至少为6位');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('两次输入的密码不一致');
      return;
    }
    
    try {
      // 创建一个自定义API方法来直接修改用户密码
      await userApi.update(selectedUser.callsign, { password: newPassword });
      
      // 重置表单
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      
      // 关闭对话框
      setPasswordDialogOpen(false);
      
      toast({
        title: '成功',
        description: '用户密码已修改',
      });
    } catch (error) {
      console.error('修改密码失败:', error);
      toast({
        title: '错误',
        description: '修改密码失败',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">账号管理</h1>
      
      <div className="flex space-x-4">
        <div className="w-1/3 space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="搜索用户呼号或邮箱..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">加载中...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <Card 
                  key={user.id} 
                  className={`cursor-pointer hover:border-primary transition-colors ${selectedUser?.id === user.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{user.callsign}</span>
                      </div>
                      <span className={`text-xs ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                        user.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'
                      } px-2 py-0.5 rounded-full`}>
                        {user.role === 'admin' ? '管理员' : 
                         user.role === 'teacher' ? '教员' : 
                         '申请者'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>电子邮箱</span>
                        <span>{user.email}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>注册时间</span>
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">未找到匹配的用户</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-2/3">
          {selectedUser ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>用户详情</CardTitle>
                  <span className={`text-xs ${
                    selectedUser.role === 'admin' ? 'bg-red-100 text-red-800' : 
                    selectedUser.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                  } px-2 py-0.5 rounded-full`}>
                    {selectedUser.role === 'admin' ? '管理员' : 
                     selectedUser.role === 'teacher' ? '教员' : 
                     '申请者'}
                  </span>
                </div>
                <CardDescription>
                  用户呼号: {selectedUser.callsign}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">电子邮箱</p>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">QQ号码</p>
                    <p>{selectedUser.qq}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">注册时间</p>
                    <p>{new Date(selectedUser.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">最后登录</p>
                    <p>{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : '从未登录'}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-4">角色管理</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">当前角色</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedUser.role === 'admin' ? '管理员 - 可以管理所有用户和系统功能' : 
                           selectedUser.role === 'teacher' ? '教员 - 可以审核申请、管理考试和活动' : 
                           '申请者 - 可以提交申请、预约考试和活动'}
                        </p>
                      </div>
                      <div className={`p-2 rounded-full ${
                        selectedUser.role === 'admin' ? 'bg-red-100' : 
                        selectedUser.role === 'teacher' ? 'bg-blue-100' : 
                        'bg-green-100'
                      }`}>
                        {selectedUser.role === 'admin' ? (
                          <Shield className="h-6 w-6 text-red-800" />
                        ) : selectedUser.role === 'teacher' ? (
                          <CheckCircle className="h-6 w-6 text-blue-800" />
                        ) : (
                          <User className="h-6 w-6 text-green-800" />
                        )}
                      </div>
                    </div>

                    {selectedUser.role !== 'admin' && (
                      <div className="flex space-x-2">
                        {selectedUser.role === 'applicant' ? (
                          <Button 
                            onClick={() => setAsTeacher(selectedUser.id)}
                            className="flex-1"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            设置为教员
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => setAsApplicant(selectedUser.id)}
                            variant="outline"
                            className="flex-1"
                          >
                            <User className="h-4 w-4 mr-2" />
                            设置为申请者
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-4">账户管理</h3>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setPasswordDialogOpen(true)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      修改密码
                    </Button>
                    
                    {selectedUser.role !== 'admin' && (
                      <Button 
                        onClick={() => setDeleteDialogOpen(true)}
                        variant="destructive"
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除账户
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border rounded-lg bg-muted/10">
              <div className="text-center p-8">
                <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">选择用户</h3>
                <p className="text-muted-foreground">从左侧列表中选择一个用户来查看详情</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 删除用户对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除用户</DialogTitle>
            <DialogDescription>
              您确定要删除用户 {selectedUser?.callsign} 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={deleteUser}>确认删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 修改密码对话框 */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改用户密码</DialogTitle>
            <DialogDescription>
              为用户 {selectedUser?.callsign} 设置新密码。
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {passwordError && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {passwordError}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input 
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="请输入新密码"
              />
              <p className="text-sm text-muted-foreground">密码长度至少为6位</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input 
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入新密码"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setPasswordDialogOpen(false);
              setNewPassword('');
              setConfirmPassword('');
              setPasswordError('');
            }}>取消</Button>
            <Button onClick={changeUserPassword}>确认修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}