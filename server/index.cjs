const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

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
      password: 'admin123', // 默认密码
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

// API路由

// 读取文件
app.get('/api/fs/read', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', req.query.path);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文件不存在' });
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('读取文件失败:', error);
    res.status(500).json({ error: '读取文件失败', details: error.message });
  }
});

// 写入文件
app.post('/api/fs/write', (req, res) => {
  try {
    const { path: filePath, data } = req.body;
    const fullPath = path.join(__dirname, '..', filePath);
    
    // 确保目录存在
    const dirPath = path.dirname(fullPath);
    ensureDirectoryExists(dirPath);
    
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
    res.json({ success: true });
  } catch (error) {
    console.error('写入文件失败:', error);
    res.status(500).json({ error: '写入文件失败', details: error.message });
  }
});

// 删除文件或目录
app.delete('/api/fs/delete', (req, res) => {
  try {
    const fullPath = path.join(__dirname, '..', req.query.path);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: '文件或目录不存在' });
    }
    
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      // 递归删除目录
      fs.rmdirSync(fullPath, { recursive: true });
    } else {
      // 删除文件
      fs.unlinkSync(fullPath);
    }
    
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
    const fullPath = path.join(__dirname, '..', dirPath);
    
    ensureDirectoryExists(fullPath);
    res.json({ success: true });
  } catch (error) {
    console.error('创建目录失败:', error);
    res.status(500).json({ error: '创建目录失败', details: error.message });
  }
});

// 列出文件
app.get('/api/fs/list', (req, res) => {
  try {
    const fullPath = path.join(__dirname, '..', req.query.path);
    
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

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});