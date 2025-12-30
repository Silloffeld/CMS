import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initializeTheme } from './hooks/use-appearance';

// Import your pages - you'll need to update these imports based on your pages
// This is a minimal example showing how to structure it
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Welcome to the Shop</div>} />
                <Route path="/login" element={<div>Login Page</div>} />
                <Route path="/register" element={<div>Register Page</div>} />
                <Route path="/admin" element={<div>Admin Dashboard</div>} />
                {/* Add more routes as needed */}
            </Routes>
        </BrowserRouter>
    );
};

const root = createRoot(document.getElementById('app')!);
root.render(<App />);

// This will set light / dark mode on load...
initializeTheme();
