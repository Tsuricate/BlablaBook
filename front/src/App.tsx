import { BrowserRouter, Routes, Route } from 'react-router';
import Register from './components/Register';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categories/:category" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
