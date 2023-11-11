import React from 'react';
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import './App.css';
import HomePage from "./pages/HomePage";
import UnborrowPage from "./pages/UnborrowPage";
import OwnedPage from "./pages/OwnedPage";
import Header from "./component/Header";
import SearchPage from "./pages/SearchPage";

function App() {
    return (
        <Router>
            <Header />
            <Link to="/homepage">开始你的租车之旅！</Link>
            <Routes>
                <Route path="/homepage" element={<HomePage/>}></Route>
                <Route path="/unborrowpage" element={<UnborrowPage/>}></Route>
                <Route path="/ownedpage" element={<OwnedPage/>}></Route>
                <Route path="/searchpage" element={<SearchPage/>}></Route>
            </Routes>
        </Router>
    );
}

export default App;