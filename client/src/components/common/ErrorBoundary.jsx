import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl border border-red-100 shadow-lg p-8 max-w-md w-full text-center">
            <span className="text-5xl mb-4 block">⚠️</span>
            <h2 className="font-heading font-bold text-dark text-xl mb-2">
              Something went wrong
            </h2>
            <p className="font-body text-gray-500 text-sm mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary text-white font-heading font-semibold rounded-xl hover:bg-blue-900 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
