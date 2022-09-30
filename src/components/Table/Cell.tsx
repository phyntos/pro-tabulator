import React from 'react';

const Cell: React.FC = ({ children }) => {
    return <td className='border p-3'>{children}</td>;
};

export default Cell;
