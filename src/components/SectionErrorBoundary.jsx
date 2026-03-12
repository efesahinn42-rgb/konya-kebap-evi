'use client';
import React from 'react';

class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`SectionErrorBoundary (${this.props.sectionName}) caught an error:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center bg-zinc-900/20 p-8 rounded-2xl border border-white/5">
          <div className="text-center">
            <p className="text-zinc-400 mb-4">
              {this.props.sectionName || 'Bu bölüm'} yüklenirken bir hata oluştu.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm"
            >
              Yeniden Dene
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;
