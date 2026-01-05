import { useEffect, useState } from "react";
import { api, setAuthToken } from "../api";

export default function Links() {
  const [links, setLinks] = useState([]);

  // Token setzen und Links laden
  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    api.get("/links")
      .then(res => setLinks(res.data))
      .catch(err => console.log("Fehler beim Laden der Links:", err));
  }, []);

  return (
    <div>
      <h2>Meine Links</h2>
      {links.length === 0 && <p>Keine Links vorhanden</p>}
      <ul>
        {links.map(link => (
          <li key={link._id}>
            <strong>{link.title}</strong> - 
            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
            {link.category && <> ({link.category})</>}
            {link.note && <p>Notiz: {link.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
