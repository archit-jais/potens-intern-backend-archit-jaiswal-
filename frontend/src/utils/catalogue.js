const searchableFields = ['company', 'title', 'domain', 'location'];

export const filterInternships = (internships, query) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return internships;
  }

  return internships.filter((item) =>
    searchableFields.some((field) => String(item[field] || '').toLowerCase().includes(normalizedQuery))
  );
};

export const getUniqueCount = (items, key) => new Set(items.map((item) => item[key]).filter(Boolean)).size;

export const getInternshipStats = (items) => ({
  total: items.length,
  companies: getUniqueCount(items, 'company'),
  domains: getUniqueCount(items, 'domain'),
  remote: items.filter((item) => item.internshipType === 'Remote').length,
});
