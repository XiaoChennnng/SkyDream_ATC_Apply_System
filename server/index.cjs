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
  }
};

// 基础数据目录
const DATA_DIR = path.join(__dirname, '../data');
ensureDirectoryExists(DATA_DIR);

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