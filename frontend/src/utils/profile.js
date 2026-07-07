export const parseCommaSeparatedSkills = (value) =>
  value
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);

export const buildRecommendationProfile = (form) => ({
  skills: parseCommaSeparatedSkills(form.skills),
  cgpa: Number(form.cgpa),
  preferredDomain: form.preferredDomain.trim(),
  preferredLocation: form.preferredLocation.trim(),
  academicYear: Number(form.academicYear),
});
