import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import React, { useContext } from 'react';
import ColorContext from '../../contexts/ColorContext';
import { SortDirection } from '../../types/table';

type SorterProps = {
    direction: SortDirection;
    setDirection: (sorter: SortDirection) => void;
};

const Sorter = ({ direction, setDirection }: SorterProps) => {
    const color = useContext(ColorContext);
    const clsxDirection = (thisDirection: SortDirection) =>
        clsx(
            'w-3 absolute right-0',
            thisDirection === 'asc' && 'top-0',
            thisDirection === 'desc' && 'bottom-0',
            direction === thisDirection
                ? [color === 'indigo' && 'text-indigo-500', color === 'blue' && 'text-blue-500']
                : 'text-gray-300 group-hover:text-gray-400',
        );

    return (
        <div
            className='w-4 min-w-4 h-5 relative cursor-pointer group'
            onClick={() => {
                if (direction === 'none') setDirection('asc');
                if (direction === 'asc') setDirection('desc');
                if (direction === 'desc') setDirection('none');
            }}
        >
            <ChevronUpIcon className={clsxDirection('asc')} />
            <ChevronDownIcon className={clsxDirection('desc')} />
        </div>
    );
};

export default Sorter;
