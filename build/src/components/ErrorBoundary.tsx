import { Component, ErrorInfo, ReactNode } from 'react';
import { clearSave } from '../hooks/useSaveGame';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 全局错误边界
 * 捕获子组件渲染异常，提供"清除存档重新开始"的恢复方案
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] 捕获到渲染异常:', error, errorInfo);
  }

  handleReset = () => {
    clearSave();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '24px',
          textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          background: 'linear-gradient(160deg, #FFFAF5, #FFF5F8)',
          color: '#333',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌸</div>
          <h2 style={{ margin: '0 0 12px', color: '#AD1457' }}>哎呀，花园出了点问题</h2>
          <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#888', maxWidth: '300px' }}>
            游戏遇到了意外错误，这可能是由于存档数据损坏导致的。
          </p>
          <p style={{ margin: '0 0 24px', fontSize: '12px', color: '#aaa', wordBreak: 'break-all', maxWidth: '300px' }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '12px 32px',
              border: 'none',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #F48FB1, #EC407A)',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(236,64,122,0.3)',
            }}
          >
            清除存档，重新开始
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
