import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingIndicator from '../components/LoadingIndicator.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useAsync } from '../hooks/useAsync';
import { backendApi } from '../services/api';
import { formatCurrencyInr, formatList } from '../utils/formatters';

function InternshipDetailsPage() {
  const { id } = useParams();
  const fetchExplanation = useCallback(() => backendApi.getInternshipExplanation(id), [id]);
  const { data, loading, error } = useAsync(fetchExplanation);

  const internship = data?.internship;
  const criteria = data?.eligibilityCriteria;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Internship Details"
        title={internship ? internship.title : 'Internship details'}
        description={internship ? `${internship.company} | ${internship.location}` : 'Review role details and eligibility criteria.'}
        actions={
          <Link className="button button-secondary" to="/catalogue">
            Back to Catalogue
          </Link>
        }
      />

      {loading && <LoadingIndicator label="Loading internship details" />}
      <ErrorMessage message={error} />

      {internship && criteria && (
        <section className="details-layout">
          <article className="details-main">
            <p className="company-name">{internship.company}</p>
            <h3>{internship.title}</h3>
            <p>{internship.description}</p>

            <div className="details-grid">
              <div>
                <span>Domain</span>
                <strong>{internship.domain}</strong>
              </div>
              <div>
                <span>Location</span>
                <strong>{internship.location}</strong>
              </div>
              <div>
                <span>Internship Type</span>
                <strong>{internship.internshipType}</strong>
              </div>
              <div>
                <span>Monthly Stipend</span>
                <strong>{formatCurrencyInr(internship.stipend)}</strong>
              </div>
            </div>
          </article>

          <aside className="details-side">
            <h3>Eligibility</h3>
            <dl className="definition-list">
              <div>
                <dt>Skills</dt>
                <dd>{formatList(criteria.requiredSkills)}</dd>
              </div>
              <div>
                <dt>Minimum CGPA</dt>
                <dd>{criteria.minimumCGPA}</dd>
              </div>
              <div>
                <dt>Academic Year</dt>
                <dd>{criteria.academicYear} or above</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{criteria.preferredLocation}</dd>
              </div>
              <div>
                <dt>Internship Type</dt>
                <dd>{criteria.internshipType}</dd>
              </div>
            </dl>

            <div className="explanation-box">
              <h4>Plain English explanation</h4>
              <p>{data.explanation}</p>
            </div>
          </aside>
        </section>
      )}
    </div>
  );
}

export default InternshipDetailsPage;
