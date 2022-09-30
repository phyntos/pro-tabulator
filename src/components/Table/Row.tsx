import React from 'react';

const Row: React.FC = ({ children }) => {
    return <tr className='bg-white dark:bg-gray-800 dark:border-gray-700'>{children}</tr>;
};

export default Row;
