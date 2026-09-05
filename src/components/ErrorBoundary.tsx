import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[App Error Boundary Caught Error]:', error, errorInfo);
  }

  public override componentDidMount() {
    window.addEventListener('error', (event) => {
      if (event.message === 'Script error.' || !event.error) {
        if (typeof event.stopImmediatePropagation === 'function') {
          event.stopImmediatePropagation();
        }
        console.warn('[Handled Global Script Error]:', event);
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      if (!event.reason) {
        if (typeof event.stopImmediatePropagation === 'function') {
          event.stopImmediatePropagation();
        }
      }
      console.warn('[Handled Unhandled Promise Rejection]:', event.reason);
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    try {
      window.location.hash = '';
      window.location.pathname = '/';
    } catch {
      // fallback
    }
  };

  private handleReload = () => {
    try {
      window.location.reload();
    } catch {
      this.setState({ hasError: false, error: null });
    }
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF6EE] text-[#0F1E36] flex items-center justify-center p-6 selection:bg-[#C88214] selection:text-white">
          <div className="max-w-md w-full bg-white border border-[#E3D8C8] p-6 sm:p-8 shadow-xl text-center space-y-5">
            <div className="w-12 h-12 bg-[#FAF6EE] border border-[#E3D8C8] text-[#C88214] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-display font-black text-[#0F1E36] tracking-tight">
                Application Recovered
              </h2>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                An unexpected display error occurred. The application state has been safely isolated.
              </p>
              {this.state.error?.message && (
                <div className="p-2.5 bg-[#FAF6EE] border border-[#E3D8C8] text-[11px] font-mono text-[#71695D] text-left break-all max-h-24 overflow-y-auto">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2.5 bg-[#C88214] hover:bg-[#0F1E36] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 px-4 py-2.5 bg-white border border-[#0F1E36] text-[#0F1E36] hover:bg-[#0F1E36] hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload App</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
