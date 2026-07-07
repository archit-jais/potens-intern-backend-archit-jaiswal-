export const formatCurrencyInr = (value) => {
  const amount = Number(value || 0);
  return `INR ${amount.toLocaleString('en-IN')}`;
};

export const formatDateTime = (value) => {
  if (!value) {
    return 'Not checked yet';
  }

  return new Date(value).toLocaleString();
};

export const formatList = (values) => {
  if (!Array.isArray(values) || values.length === 0) {
    return 'Not specified';
  }

  return values.join(', ');
};
