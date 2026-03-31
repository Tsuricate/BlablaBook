import { BrowserRouter, Routes, Route } from 'react-router';
import { UserProvider } from './context/UserContext';
import { LibraryProvider } from './context/LibraryContext';

import Register from './components/Register';
import HomePage from './components/HomePage';
import BookDetails from './components/BookDetails';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Account from './components/Account';
import PublicRoute from './components/PublicRoute';
import Terms from './components/Terms';
import CategoryPage from './components/CategoryPage';
import LibraryPage from './components/LibraryPage';
import LibraryAllBooks from './components/LibraryAllBooks';
import LibraryCollections from './components/LibraryCollections';
import LibraryCollectionDetails from './components/LibraryCollectionDetails';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:category/:id" element={<BookDetails />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/library"
              element={
                <LibraryProvider>
                  <LibraryPage />
                </LibraryProvider>
              }
            >
              <Route index element={<LibraryAllBooks />} />
              <Route path="collections" element={<LibraryCollections />} />
              <Route path="collections/:collection" element={<LibraryCollectionDetails />} />
            </Route>
          </Route>
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
