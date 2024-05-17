import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageExtraits from './Pages/PageExtraits';
import PageCategories from './Pages/PageCategories';
import PageSynthese from './Pages/PageSynthese';
import CriteriaContextProvider from './Pages/CriteriaContext';
import AppContextProvider from './Pages/AppContext';
import PagePrevisions from './Pages/PagePrevisions';
import PageConfiguration from './Pages/PageConfiguration';

function App() {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <CriteriaContextProvider>
          <Routes>
            <Route path="/" element={<PageExtraits />}></Route>
            <Route path="/categories" element={<PageCategories />}></Route>
            <Route path="/synthese" element={<PageSynthese />}></Route>
            <Route path="/previsions" element={<PagePrevisions />}></Route>
            <Route path="/configuration" element={<PageConfiguration />}></Route>
          </Routes>
        </CriteriaContextProvider>
      </AppContextProvider>
    </BrowserRouter>
  );
}

export default App;
