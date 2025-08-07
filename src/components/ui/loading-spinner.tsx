import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export function LoadingSpinner({ size = 'medium', text }: LoadingSpinnerProps) {
  // 根据尺寸确定样式
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4'
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`${sizeClasses[size]} rounded-full border-t-primary animate-spin`}
        style={{ borderTopColor: 'currentColor', borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }}
      />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}

export function LoadingOverlay({ text = '数据加载中...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-lg font-medium">{text}</p>
      </div>
    </div>
  );
}

export function LoadingCard({ text = '数据加载中...' }: { text?: string }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <LoadingSpinner size="medium" />
      <p className="mt-4 text-muted-foreground">{text}</p>
    </div>
  );
}