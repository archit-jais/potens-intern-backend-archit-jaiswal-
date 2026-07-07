function ScoreBadge({ score }) {
  return <span className="score-badge">{Number(score || 0).toFixed(0)}/100</span>;
}

export default ScoreBadge;
