import React, {useRef, useEffect} from 'react';
import game from "./game/Game";

const App = () => {

    const containerRef = useRef();

    useEffect(() => {
        game.init(containerRef);
    }, []);

    return (
        <div ref={containerRef} />
    );
};

export default App;
