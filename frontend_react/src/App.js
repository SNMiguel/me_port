import React from 'react';

import { About, Footer, Header, Skills, Testimonial, Work} from './container';
import { Navbar } from './components';
import './App.scss';

const App = () => {
    return (
        <div className="App">
            <Navbar />
            <Header />
            <About />
            <Skills />
            <Work />
            <Testimonial />
            <Footer /> 
        </div>
    );
}

export default App;