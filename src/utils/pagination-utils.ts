/**
 * 分页工具函数
 * 用于处理大量数据的分页加载
 */

/**
 * 对数据进行分页
 * @param data 要分页的数据数组
 * @param page 当前页码（从1开始）
 * @param pageSize 每页数据量
 * @returns 分页后的数据和分页信息
 */
export function paginateData<T>(data: T[], page: number = 1, pageSize: number = 10) {
  // 确保页码和每页数据量有效
  const validPage = Math.max(1, page);
  const validPageSize = Math.max(1, pageSize);
  
  // 计算总页数
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / validPageSize);
  
  // 计算当前页的数据范围
  const startIndex = (validPage - 1) * validPageSize;
  const endIndex = Math.min(startIndex + validPageSize, totalItems);
  
  // 获取当前页的数据
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      page: validPage,
      pageSize: validPageSize,
      totalItems,
      totalPages,
      hasNextPage: validPage < totalPages,
      hasPrevPage: validPage > 1
    }
  };
}

/**
 * 创建分页导航信息
 * @param currentPage 当前页码
 * @param totalPages 总页数
 * @param maxPageButtons 最大显示的页码按钮数
 * @returns 分页导航信息
 */
export function createPagination(currentPage: number, totalPages: number, maxPageButtons: number = 5) {
  // 确保参数有效
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const validMaxPageButtons = Math.max(3, maxPageButtons);
  
  // 计算显示的页码范围
  let startPage = Math.max(1, validCurrentPage - Math.floor(validMaxPageButtons / 2));
  let endPage = startPage + validMaxPageButtons - 1;
  
  // 调整范围，确保不超出总页数
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - validMaxPageButtons + 1);
  }
  
  // 生成页码数组
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  
  return {
    currentPage: validCurrentPage,
    totalPages,
    pages,
    showFirst: startPage > 1,
    showLast: endPage < totalPages,
    hasPrev: validCurrentPage > 1,
    hasNext: validCurrentPage < totalPages,
    prevPage: Math.max(1, validCurrentPage - 1),
    nextPage: Math.min(totalPages, validCurrentPage + 1)
  };
}