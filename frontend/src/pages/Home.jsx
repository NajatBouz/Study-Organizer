import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Willkommen bei Study Organizer</h1>
      <p>Bitte logge dich ein oder erstelle einen Account, um loszulegen.</p>
      <div>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Registrieren</button>
        </Link>
      </div>
    </div>
  );
}
