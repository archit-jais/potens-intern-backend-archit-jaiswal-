import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingIndicator from '../components/LoadingIndicator.jsx';
import PageHeader from '../components/PageHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAsync } from '../hooks/useAsync';
import { backendApi } from '../services/api';
import { filterInternships } from '../utils/catalogue';
import { formatCurrencyInr } from '../utils/formatters';

function CataloguePage() {
  const [search, setSearch] = useState('');
  const { data, loading, error } = useAsync(backendApi.listInternships);
  const internships = useMemo(() => data || [], [data]);

  const filteredInternships = useMemo(() => {
    return filterInternships(internships, search);
  }, [internships, search]);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Catalogue"
        title="Internship catalogue"
        description="Browse all internships loaded from the backend and search by company, title, domain, or location."
        actions={
          <Link className="button button-primary" to="/recommend">
            Generate Recommendations
          </Link>
        }
      />

      <section className="table-card">
        <div className="table-toolbar">
          <div>
            <h3>All internships</h3>
            <p>{filteredInternships.length} visible</p>
          </div>
          <input
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search company, title, domain, location"
            aria-label="Search internships"
          />
        </div>

        {loading && <LoadingIndicator label="Loading internships" />}
        <ErrorMessage message={error} />

        {!loading && !error && filteredInternships.length === 0 && (
          <EmptyState title="No internships found" message="Try a broader search term." />
        )}

        {!loading && !error && filteredInternships.length > 0 && (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Title</th>
                  <th>Domain</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Stipend</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredInternships.map((item) => (
                  <tr key={item.id}>
                    <td>{item.company}</td>
                    <td>{item.title}</td>
                    <td>{item.domain}</td>
                    <td>{item.location}</td>
                    <td>{item.internshipType}</td>
                    <td>{formatCurrencyInr(item.stipend)}</td>
                    <td>
                      <Link className="table-link" to={`/internships/${item.id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default CataloguePage;
