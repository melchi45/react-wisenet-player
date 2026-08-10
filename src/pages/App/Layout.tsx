import React from 'react';
import { Playground } from './Playground';
import { BrowserRouter } from "react-router-dom";

export const Layout: React.FC = () => {
    return (
        <div className={`app`}>
            <BrowserRouter>
                <Playground></Playground>
            </BrowserRouter>
        </div>
    );
};
