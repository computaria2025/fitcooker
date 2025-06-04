
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Cooks from './pages/Cooks';
import About from './pages/About';
import Contato from './pages/Contato';
import NotFound from './pages/NotFound';
import CookProfile from './pages/CookProfile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AddRecipe from './pages/AddRecipe';
import ForgotPassword from './pages/ForgotPassword';
import AlimentacaoSaudavel from './pages/AlimentacaoSaudavel';
import FeaturedPage from './pages/FeaturedPage';
import QuemSomos from './pages/QuemSomos';
import Privacidade from './pages/Privacidade';
import TermosDeUso from './pages/TermosDeUso';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/cooks" element={<Cooks />} />
          <Route path="/cook/:id" element={<CookProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contato />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/alimentacao-saudavel" element={<AlimentacaoSaudavel />} />
          <Route path="/destaques" element={<FeaturedPage />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/termos-de-uso" element={<TermosDeUso />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
