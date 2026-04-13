import { useState, useEffect, useCallback } from "react";

export function useApi(url, interval = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    fetch(url)
      .then(r => r.json())
      .then(d => { setData(d); setError(null); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [url]);

  useEffect(() => {
    refresh();
    if (interval) {
      const id = setInterval(refresh, interval);
      return () => clearInterval(id);
    }
  }, [refresh, interval]);

  return { data, loading, error, refresh };
}

export async function apiPost(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiPatch(url, body) {
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiDelete(url) {
  const res = await fetch(url, { method: "DELETE" });
  return res.json();
}
