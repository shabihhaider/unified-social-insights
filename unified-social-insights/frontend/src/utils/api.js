export async function fetchInsights(data) {
  const res = await fetch("http://localhost:5050/api/insights/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.details || "Failed to fetch insights");
  }

  return res.json();
}
