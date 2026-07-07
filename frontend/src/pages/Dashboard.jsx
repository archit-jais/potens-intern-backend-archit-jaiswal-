import { Link } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingIndicator from '../components/LoadingIndicator.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAsync } from '../hooks/useAsync';
import { backendApi } from '../services/api';
import { getInternshipStats } from '../utils/catalogue';
import { formatDateTime } from '../utils/formatters';

function Dashboard() {
  const {
    data: health,
    loading: healthLoading,
    error: healthError,
  } = useAsync(backendApi.getBackendHealth);

  const {
    data: items,
    loading: itemsLoading,
    error: itemsError,
  } = useAsync(backendApi.listInternships);

  const internships = items || [];
  const stats = getInternshipStats(internships);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Dashboard"
        title="Internship recommendation workspace"
        description="Monitor backend availability, catalogue volume, and the internship mix before generating recommendations."
        actions={
          <>
            <Link className="button button-primary" to="/recommend">
              Open Recommendation Page
            </Link>
            <Link className="button button-secondary" to="/catalogue">
              View Internship Catalogue
            </Link>
          </>
        }
      />

      {(healthLoading || itemsLoading) && <LoadingIndicator label="Loading dashboard data" />}
      <ErrorMessage message={healthError || itemsError} />

      <section className="stats-grid">
        <StatCard
          label="Backend Health"
          value={health?.status === 'ok' ? 'Online' : 'Unavailable'}
          detail={`Checked ${formatDateTime(health?.timestamp)}`}
        />
        <StatCard label="Total Internships" value={stats.total} detail="Loaded from backend catalogue" />
        <StatCard label="Companies" value={stats.companies} detail="Unique hiring organizations" />
        <StatCard label="Domains" value={stats.domains} detail="Distinct career tracks" />
        <StatCard label="Remote Roles" value={stats.remote} detail="Flexible internship options" />
      </section>
    </div>
  );
}

export default Dashboard;
