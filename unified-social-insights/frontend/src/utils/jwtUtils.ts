export const getTokenExpiration = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return null;
    return payload.exp * 1000; // Convert to ms
  } catch (err) {
    console.error('Invalid JWT:', err);
    return null;
  }
};
