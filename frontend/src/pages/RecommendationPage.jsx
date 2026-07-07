import { useState } from 'react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingIndicator from '../components/LoadingIndicator.jsx';
import PageHeader from '../components/PageHeader.jsx';
import RecommendationCard from '../components/RecommendationCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { backendApi, getApiErrorMessage } from '../services/api';
import { buildRecommendationProfile } from '../utils/profile';

const initialForm = {
  skills: '',
  cgpa: '',
  preferredDomain: '',
  preferredLocation: '',
  academicYear: '',
};

function RecommendationPage() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const profile = buildRecommendationProfile(form);

    try {
      const data = await backendApi.recommendInternships(profile);
      setResult(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const recommendations = result?.recommendations || [];

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Recommendation"
        title="Find the best internships for a student profile"
        description="Enter a structured profile. The backend compares it with every internship and returns the top matches with scoring reasons."
      />

      <section className="content-grid">
        <form className="form-card" onSubmit={submitProfile}>
          <label>
            Skills
            <input
              name="skills"
              value={form.skills}
              onChange={updateField}
              placeholder="JavaScript, Node.js, SQL"
              required
            />
            <span>Enter multiple skills separated by commas.</span>
          </label>

          <div className="form-row">
            <label>
              CGPA
              <input
                name="cgpa"
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={form.cgpa}
                onChange={updateField}
                placeholder="8.2"
                required
              />
            </label>
            <label>
              Academic Year
              <input
                name="academicYear"
                type="number"
                min="1"
                max="5"
                value={form.academicYear}
                onChange={updateField}
                placeholder="3"
                required
              />
            </label>
          </div>

          <label>
            Preferred Domain
            <input
              name="preferredDomain"
              value={form.preferredDomain}
              onChange={updateField}
              placeholder="Backend Development"
              required
            />
          </label>

          <label>
            Preferred Location
            <input
              name="preferredLocation"
              value={form.preferredLocation}
              onChange={updateField}
              placeholder="Chennai"
              required
            />
          </label>

          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Recommendations'}
          </button>
        </form>

        <section className="results-panel">
          <div className="section-heading">
            <h3>Top recommendations</h3>
            {result?.profile && <p>{result.profile.skills.length} skills submitted</p>}
          </div>

          {loading && <LoadingIndicator label="Scoring internships" />}
          <ErrorMessage message={error} />

          {!loading && !error && result && recommendations.length === 0 && (
            <EmptyState title="No matching internships" message="Try a different domain, location, or broader skill set." />
          )}

          <div className="recommendation-list">
            {recommendations.map((recommendation) => (
              <RecommendationCard key={recommendation.internship.id} recommendation={recommendation} />
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

export default RecommendationPage;
