export const fetchFacebookOAuthConfig = async () => {
  const res = await fetch("http://localhost:5050/api/config/oauth-config");
  if (!res.ok) throw new Error("Failed to fetch OAuth config");
  return await res.json();
};
