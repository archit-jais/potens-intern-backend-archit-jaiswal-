import { Link } from 'react-router-dom';
import ScoreBadge from './ScoreBadge.jsx';

function RecommendationCard({ recommendation }) {
  const internship = recommendation.internship || {};
  const matchedSkills = recommendation.scoreBreakdown?.skills?.matched || recommendation.matchedFields?.skills?.matched || [];

  return (
    <article className="recommendation-card">
      <div className="recommendation-card__header">
        <div>
          <p className="company-name">{internship.company}</p>
          <h3>{internship.title}</h3>
        </div>
        <ScoreBadge score={recommendation.score} />
      </div>

      <div className="meta-row">
        <span>{internship.domain}</span>
        <span>{internship.location}</span>
        <span>{internship.internshipType}</span>
      </div>

      <div className="skill-list">
        {matchedSkills.length > 0 ? (
          matchedSkills.map((skill) => <span key={skill}>{skill}</span>)
        ) : (
          <span>No direct skill match</span>
        )}
      </div>

      <p className="explanation">{recommendation.explanation}</p>

      <Link className="button button-secondary" to={`/internships/${internship.id}`}>
        View Details
      </Link>
    </article>
  );
}

export default RecommendationCard;
