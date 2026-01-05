import { useEffect, useState } from "react";
import { api, setAuthToken } from "../api";

export default function Folders() {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    api.get("/folders")
      .then(res => setFolders(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Meine Ordner</h2>
      <ul>
        {folders.map(f => (
          <li key={f._id}>{f.name}</li>
        ))}
      </ul>
    </div>
  );
}
