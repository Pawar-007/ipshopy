import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Decoded user:", decoded);
    setUser(decoded);

    fetch("http://localhost:8000/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...decoded,
      accessToken: credentialResponse.credential,
    }),
  })
  .then(res => res.json())
  .then(data => console.log("User saved:", data))
  .catch(err => console.error(err));
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="App">
      <h1>Google Authentication Demo</h1>

      {!user ? (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      ) : (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <img src={user.picture} alt={user.name} />
        </div>
      )}
    </div>
  );
}

export default App;
