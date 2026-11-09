import React from "react";
import ParkitLogo from "./ParkitLogo";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PARKIT Uncaught Render Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetState = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 border border-slate-700 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 p-3 rounded-2xl flex items-center justify-center">
              <ParkitLogo className="w-full h-full object-contain" />
            </div>

            <h1 className="text-2xl font-black text-white mb-2">
              PARK<span className="text-sky-400">IT</span>
            </h1>

            <p className="text-sm text-slate-300 font-medium mb-6">
              An unexpected issue occurred while rendering the interface.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold rounded-xl shadow-lg transition active:scale-95"
              >
                Reload Website
              </button>

              <button
                onClick={this.handleResetState}
                className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                Reset Saved State & Reload
              </button>
            </div>

            {this.state.error && (
              <details className="mt-6 text-left text-xs text-slate-400 bg-slate-900/80 p-3 rounded-xl overflow-auto max-h-32">
                <summary className="cursor-pointer font-semibold text-slate-300 mb-1">
                  Technical Details
                </summary>
                <p className="font-mono text-[11px] text-rose-300">
                  {this.state.error.toString()}
                </p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

