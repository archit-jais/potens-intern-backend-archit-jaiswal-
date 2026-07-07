function LoadingIndicator({ label = 'Loading' }) {
  return (
    <div className="loading-indicator" role="status" aria-live="polite">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingIndicator;
