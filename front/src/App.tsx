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
import { useTranslation } from 'react-i18next';
import LibraryPage from './components/LibraryPage';
import LibraryAllBooks from './components/LibraryAllBooks';
import LibraryCollections from './components/LibraryCollections';
import LibraryCollectionDetails from './components/LibraryCollectionDetails';
import { Toaster } from './components/ui/toaster';

const App = () => {
  const { i18n } = useTranslation();
  return (
    <UserProvider>
      <LibraryProvider>
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books/:category/:id" element={<BookDetails />} />
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
              <Route path="/library" element={<LibraryPage />}>
                <Route index element={<LibraryAllBooks />} />
                <Route path="collections" element={<LibraryCollections />} />
                <Route path="collections/:collection" element={<LibraryCollectionDetails />} />
              </Route>
            </Route>
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </BrowserRouter>
      </LibraryProvider>
    </UserProvider>
  );
};

export default App;
