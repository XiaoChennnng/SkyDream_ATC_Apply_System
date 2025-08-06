/**
 * 数据工具函数
 * 用于读写数据文件
 */

// 读取数据
export const readData = async (filename: string): Promise<any> => {
  try {
    const response = await fetch(`/api/fs/read?path=data/${filename}`);
    if (!response.ok) {
      if (response.status === 404) {
        // 文件不存在，返回空数组
        return [];
      }
      throw new Error(`读取数据失败: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`读取数据文件 ${filename} 失败:`, error);
    throw error;
  }
};

// 写入数据
export const writeData = async (filename: string, data: any): Promise<void> => {
  try {
    const response = await fetch('/api/fs/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: `data/${filename}`,
        data,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`写入数据失败: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`写入数据文件 ${filename} 失败:`, error);
    throw error;
  }
};