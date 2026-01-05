import { useState } from "react";
import { api, setAuthToken } from "../api";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    const token = localStorage.getItem("token");
    setAuthToken(token);

    try {
      const res = await api.get(`/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <input
        type="text"
        placeholder="Suchen (Kontakt, Link, Termin...)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "10px", width: "250px" }}
      />
      <button onClick={handleSearch} style={{ marginLeft: "10px" }}>
        Suchen
      </button>

      {results && (
        <div style={{ marginTop: "15px" }}>
          {results.contacts?.length > 0 && (
            <>
              <h4>Kontakte</h4>
              {results.contacts.map(c => (
                <Link key={c._id} to="/contacts">
                  <div>{c.name}</div>
                </Link>
              ))}
            </>
          )}

          {results.links?.length > 0 && (
            <>
              <h4>Links</h4>
              {results.links.map(l => (
                <Link key={l._id} to="/links">
                  <div>{l.title}</div>
                </Link>
              ))}
            </>
          )}

          {results.events?.length > 0 && (
            <>
              <h4>Termine</h4>
              {results.events.map(e => (
                <Link key={e._id} to="/events">
                  <div>{e.title}</div>
                </Link>
              ))}
            </>
          )}

          {results.folders?.length > 0 && (
            <>
              <h4>Ordner</h4>
              {results.folders.map(f => (
                <Link key={f._id} to="/folders">
                  <div>{f.name}</div>
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
