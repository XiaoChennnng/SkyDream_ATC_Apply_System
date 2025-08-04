import { AuthContext, AuthProvider, AuthContextType } from './auth-provider';
import { useContext } from 'react';

// 导出钩子函数
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
}

// 重新导出
export { AuthProvider, AuthContext };
export type { AuthContextType };