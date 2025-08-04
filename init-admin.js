// 初始化管理员账号脚本
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保目录存在
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`创建目录: ${dirPath}`);
  }
};

// 基础数据目录
const DATA_DIR = path.join(__dirname, 'data');
const USERS_DIR = path.join(DATA_DIR, 'users');
const ADMIN_DIR = path.join(USERS_DIR, 'ADMIN');

// 创建必要的目录
ensureDirectoryExists(DATA_DIR);
ensureDirectoryExists(USERS_DIR);
ensureDirectoryExists(ADMIN_DIR);
ensureDirectoryExists(path.join(ADMIN_DIR, 'applications'));
ensureDirectoryExists(path.join(ADMIN_DIR, 'exams'));
ensureDirectoryExists(path.join(ADMIN_DIR, 'activities'));
ensureDirectoryExists(path.join(ADMIN_DIR, 'attachments'));

// 创建文件系统索引
const fsIndex = {
  users: {
    ADMIN: {
      profile: null,
      applications: {},
      exams: {},
      activities: {},
      attachments: {}
    }
  }
};

// 创建管理员用户 - 使用英文名称避免编码问题
const adminUser = {
  id: uuidv4(),
  callsign: 'ADMIN',
  name: 'System Administrator',
  email: 'admin@skydream.com',
  password: 'admin123',
  role: 'admin',
  status: 'active',
  permissions: ['all'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// 保存文件系统索引
fs.writeFileSync(
  path.join(DATA_DIR, 'index.json'),
  JSON.stringify(fsIndex, null, 2),
  'utf8'
);
console.log('文件系统索引已创建');

// 保存管理员用户数据
fs.writeFileSync(
  path.join(ADMIN_DIR, 'profile.json'),
  JSON.stringify(adminUser, null, 2),
  'utf8'
);
console.log('管理员账号已创建');

// 更新文件系统索引中的管理员信息
fsIndex.users.ADMIN.profile = adminUser;
fs.writeFileSync(
  path.join(DATA_DIR, 'index.json'),
  JSON.stringify(fsIndex, null, 2),
  'utf8'
);
console.log('文件系统索引已更新');

console.log('初始化完成！');
console.log('管理员账号: admin');
console.log('管理员密码: admin123');