/**
 * 数据压缩工具
 * 用于减少数据传输量和存储空间
 */

/**
 * 压缩JSON数据
 * @param data 要压缩的数据
 * @returns 压缩后的字符串
 */
export function compressData(data: any): string {
  try {
    // 将数据转换为JSON字符串
    const jsonString = JSON.stringify(data);
    
    // 使用简单的RLE压缩算法压缩重复字符
    return simpleRLECompress(jsonString);
  } catch (error) {
    console.error('数据压缩失败:', error);
    // 如果压缩失败，返回原始JSON字符串
    return JSON.stringify(data);
  }
}

/**
 * 解压缩JSON数据
 * @param compressedData 压缩后的字符串
 * @returns 解压缩后的数据
 */
export function decompressData<T = any>(compressedData: string): T {
  try {
    // 使用简单的RLE解压缩算法解压缩
    const jsonString = simpleRLEDecompress(compressedData);
    
    // 将JSON字符串解析为数据
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('数据解压缩失败:', error);
    // 如果解压缩失败，尝试直接解析
    return JSON.parse(compressedData);
  }
}

/**
 * 简单的RLE压缩算法
 * 对连续重复的字符进行压缩
 * 使用更安全的压缩标记来避免与用户数据冲突
 * @param input 输入字符串
 * @returns 压缩后的字符串
 */
function simpleRLECompress(input: string): string {
  if (!input || input.length <= 3) {
    return input;
  }
  
  // 使用更安全的压缩标记，避免与常见字符冲突
  const COMPRESS_MARKER = '\u0001'; // 使用控制字符作为压缩标记
  
  let result = '';
  let count = 1;
  let current = input[0];
  
  for (let i = 1; i < input.length; i++) {
    if (input[i] === current && count < 255) {
      count++;
    } else {
      // 只有当重复次数大于3时才进行压缩
      if (count >= 4) {
        result += `${COMPRESS_MARKER}${count}${current}`;
      } else {
        result += current.repeat(count);
      }
      current = input[i];
      count = 1;
    }
  }
  
  // 处理最后一组字符
  if (count >= 4) {
    result += `${COMPRESS_MARKER}${count}${current}`;
  } else {
    result += current.repeat(count);
  }
  
  // 如果压缩后的字符串更长，则返回原始字符串
  return result.length < input.length ? result : input;
}

/**
 * 简单的RLE解压缩算法
 * 解压缩使用RLE算法压缩的字符串
 * @param input 压缩后的字符串
 * @returns 解压缩后的字符串
 */
function simpleRLEDecompress(input: string): string {
  if (!input) {
    return input;
  }
  
  const COMPRESS_MARKER = '\u0001'; // 与压缩时使用相同的标记
  
  let result = '';
  let i = 0;
  
  while (i < input.length) {
    if (input[i] === COMPRESS_MARKER && i + 2 < input.length) {
      // 找到压缩标记
      let countStr = '';
      i++;
      
      // 读取重复次数
      while (i < input.length && /\d/.test(input[i])) {
        countStr += input[i];
        i++;
      }
      
      if (i < input.length && countStr) {
        const count = parseInt(countStr, 10);
        const char = input[i];
        result += char.repeat(count);
      }
    } else {
      // 未压缩的字符
      result += input[i];
    }
    i++;
  }
  
  return result;
}
