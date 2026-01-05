import { useEffect, useState } from "react"; 
import { api, setAuthToken } from "../api"; 

export default function Contacts() { 
  const [contacts, setContacts] = useState([]); 

  useEffect(() => { 
    const token = localStorage.getItem("token"); 
    setAuthToken(token); 

    api.get("/contacts") 
      .then(res => setContacts(res.data)) 
      .catch(err => console.log(err)); 
  }, []); 

  return ( 
    <div> 
      <h2>Meine Kontakte</h2> 
      <ul>
  {contacts.map(c => (
    <li key={c._id} style={{ marginBottom: "15px" }}>
      <strong>{c.name}</strong> ({c.role}) <br />
      Email: {c.email} <br />
      Telefon: {c.phone} <br />
      Kategorie: {c.category} <br />
    </li>
  ))}
</ul>

    </div> 
  ); 
}
