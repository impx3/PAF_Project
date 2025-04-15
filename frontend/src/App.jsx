import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile';
import Followers from './pages/Followers';
import Home from './pages/Home';
import DeleteAccount from './pages/DeleteAccount';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import LeftPanel from './components/LeftPanel';
import Header from './components/Header';
import EditProfile from './pages/EditProfile';
import UserList from './pages/UserList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
	{/* <div className="flex"> */}
         <LeftPanel />
        <div className="ml-64 flex-grow">
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/followers" element={<PrivateRoute><Followers /></PrivateRoute>} />
            <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            <Route path="/delete-account" element={<PrivateRoute><DeleteAccount /></PrivateRoute>} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<UserList />} />
          </Routes>
        </div>
       {/* </div> */}
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
    </AuthProvider>
  );
}

export default App;
