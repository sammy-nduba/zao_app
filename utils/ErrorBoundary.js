import React, { Component } from 'react';
import ErrorFallbackScreen from '../utils/ErrorFallBackScreen';


export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught in boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackScreen error={this.state.error?.message} />;
    }
    return this.props.children; 
  }
}