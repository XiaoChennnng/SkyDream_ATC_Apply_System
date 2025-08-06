const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// 基本中间件配置
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: false
}));

// 使用 Express 内置的 JSON 解析
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 确保目录存在
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`创建目录: ${dirPath}`);
    return true;
  }
  return false;
};

// 基础数据目录
const DATA_DIR = path.join(__dirname, '../data');
const USERS_DIR = path.join(DATA_DIR, 'users');
ensureDirectoryExists(DATA_DIR);
ensureDirectoryExists(USERS_DIR);

// 检查并创建默认管理员账号
const initAdminAccount = () => {
  const ADMIN_DIR = path.join(USERS_DIR, 'ADMIN');
  const ADMIN_PROFILE_PATH = path.join(ADMIN_DIR, 'profile.json');
  const INDEX_PATH = path.join(DATA_DIR, 'index.json');
  
  // 检查用户目录是否为空
  const userDirs = fs.existsSync(USERS_DIR) ? fs.readdirSync(USERS_DIR) : [];
  const isEmpty = userDirs.length === 0;
  
  // 检查管理员账号是否存在
  const adminExists = fs.existsSync(ADMIN_PROFILE_PATH);
  
  if (isEmpty || !adminExists) {
    console.log('未检测到管理员账号，正在创建默认管理员账号...');
    
    // 创建管理员目录结构
    ensureDirectoryExists(ADMIN_DIR);
    ensureDirectoryExists(path.join(ADMIN_DIR, 'applications'));
    ensureDirectoryExists(path.join(ADMIN_DIR, 'exams'));
    ensureDirectoryExists(path.join(ADMIN_DIR, 'activities'));
    ensureDirectoryExists(path.join(ADMIN_DIR, 'attachments'));
    
    // 创建管理员用户
    const adminUser = {
      id: require('crypto').randomUUID(),
      callsign: 'ADMIN',
      name: '系统管理员',
      email: 'admin@skydream.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      permissions: ['all'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 保存管理员用户数据
    fs.writeFileSync(
      ADMIN_PROFILE_PATH,
      JSON.stringify(adminUser, null, 2),
      'utf8'
    );
    
    // 创建或更新文件系统索引
    let fsIndex = { users: {} };
    if (fs.existsSync(INDEX_PATH)) {
      try {
        fsIndex = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
      } catch (error) {
        console.error('读取索引文件失败，将创建新索引:', error);
      }
    }
    
    // 确保users对象存在
    if (!fsIndex.users) {
      fsIndex.users = {};
    }
    
    // 添加管理员信息到索引
    fsIndex.users.ADMIN = {
      profile: adminUser,
      applications: {},
      exams: {},
      activities: {},
      attachments: {}
    };
    
    // 保存更新后的索引
    fs.writeFileSync(
      INDEX_PATH,
      JSON.stringify(fsIndex, null, 2),
      'utf8'
    );
    
    console.log('默认管理员账号已创建:');
    console.log('用户名: ADMIN');
    console.log('密码: admin123');
  }
};

// 初始化管理员账号
initAdminAccount();

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: '服务器运行正常'
  });
});

// 读取文件
app.get('/api/fs/read', (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath) {
      return res.status(400).json({ error: '文件路径不能为空' });
    }
    
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: '文件不存在' });
    }
    
    const data = fs.readFileSync(fullPath, 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (error) {
    console.error('读取文件失败:', error);
    res.status(500).json({ error: '读取文件失败', details: error.message });
  }
});

// 写入文件
app.post('/api/fs/write', (req, res) => {
  try {
    const { path: filePath, data } = req.body;
    if (!filePath) {
      return res.status(400).json({ error: '文件路径不能为空' });
    }
    
    const fullPath = path.join(__dirname, '..', filePath);
    
    // 确保目录存在
    const dirPath = path.dirname(fullPath);
    ensureDirectoryExists(dirPath);
    
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`文件写入成功: ${fullPath}`);
    res.json({ success: true });
  } catch (error) {
    console.error('写入文件失败:', error);
    res.status(500).json({ error: '写入文件失败', details: error.message });
  }
});

// 删除文件或目录
app.delete('/api/fs/delete', (req, res) => {
  try {
    const queryPath = req.query.path;
    if (!queryPath) {
      return res.status(400).json({ error: '文件路径不能为空' });
    }
    
    const fullPath = path.join(__dirname, '..', queryPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`路径不存在，视为删除成功: ${fullPath}`);
      return res.json({ success: true });
    }
    
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      // 使用更强制的删除方式处理目录
      try {
        fs.rmSync(fullPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
      } catch (rmError) {
        // 如果rmSync失败，尝试使用rm -rf（Windows下使用rmdir /s /q）
        console.warn(`rmSync失败，尝试使用系统命令删除: ${rmError.message}`);
        const { execSync } = require('child_process');
        try {
          if (process.platform === 'win32') {
            execSync(`rmdir /s /q "${fullPath}"`, { stdio: 'ignore' });
          } else {
            execSync(`rm -rf "${fullPath}"`, { stdio: 'ignore' });
          }
        } catch (execError) {
          console.error('系统命令删除也失败:', execError);
          throw rmError; // 抛出原始错误
        }
      }
    } else {
      fs.unlinkSync(fullPath);
    }
    
    console.log(`删除成功: ${fullPath}`);
    res.json({ success: true });
  } catch (error) {
    console.error('删除文件或目录失败:', error);
    res.status(500).json({ error: '删除文件或目录失败', details: error.message });
  }
});

// 创建目录
app.post('/api/fs/mkdir', (req, res) => {
  try {
    const { path: dirPath } = req.body;
    if (!dirPath) {
      return res.status(400).json({ error: '目录路径不能为空' });
    }
    
    const fullPath = path.join(__dirname, '..', dirPath);
    ensureDirectoryExists(fullPath);
    console.log(`目录创建成功: ${fullPath}`);
    res.json({ success: true });
  } catch (error) {
    console.error('创建目录失败:', error);
    res.status(500).json({ error: '创建目录失败', details: error.message });
  }
});

// 列出文件
app.get('/api/fs/list', (req, res) => {
  try {
    const queryPath = req.query.path || '';
    const fullPath = path.join(__dirname, '..', queryPath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: '目录不存在' });
    }
    
    const files = fs.readdirSync(fullPath);
    res.json(files);
  } catch (error) {
    console.error('列出文件失败:', error);
    res.status(500).json({ error: '列出文件失败', details: error.message });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ 
    error: '服务器内部错误', 
    details: err.message
  });
});

// 启动服务器
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://0.0.0.0:${PORT}`);
  console.log(`本地访问: http://localhost:${PORT}`);
  console.log(`公网访问: http://你的公网IP:${PORT}`);
  console.log('服务器启动成功！');
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});