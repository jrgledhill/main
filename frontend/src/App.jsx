import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePage from "./pages/CreatePage";
import EditProductPage from "./pages/EditProductPage";
import useAuthReq from "./hooks/useAuthReq";
import useUserSync from "./hooks/useUserSync";

/**
 * Root application component that synchronizes user state, waits for the auth client to load, and renders the app layout with a navbar and route-based pages.
 *
 * Profile, create, and edit routes are accessible only when the user is signed in; the component renders nothing until the auth client has finished loading.
 *
 * @returns {JSX.Element|null} The rendered application element, or `null` while the authentication client is loading.
 */
function App() {
  const { isClerkLoaded, isSignedIn } = useAuthReq();
  useUserSync();

  if (!isClerkLoaded) return null;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage /> } />
          <Route 
            path="/profile" 
            element={isSignedIn ? 
            <ProfilePage /> : 
            <Navigate to={"/"} />} />
          <Route 
            path="/create" 
            element={isSignedIn ? 
            <CreatePage /> : 
            <Navigate to={"/"} />} />
          <Route
            path="/edit/:id"
            element={isSignedIn ? 
            <EditProductPage /> : 
            <Navigate to={"/"} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;