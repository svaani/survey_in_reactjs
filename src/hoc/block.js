import React from 'react';

//Similar to Fragments
const Block = props => {
    return <div style={{"display":"block"}}>{props.children}</div>
};

export default Block;