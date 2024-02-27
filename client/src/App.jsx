import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Header from './components/header';
// import Footer from './components/footer.jsx';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  // const location = useLocation();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />}/>
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/projects" element={<Projects />} />
        <Route path='/about' element={<About />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  )
}

export default App;

