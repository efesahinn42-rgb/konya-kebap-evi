'use client';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
          <div className="max-w-md w-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Bir hata oluştu</h2>
            <p className="text-zinc-400 mb-6">
              Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 bg-[#d4af37] hover:bg-[#b8962e] text-black font-semibold rounded-lg transition-colors"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
