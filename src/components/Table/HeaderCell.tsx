import clsx from 'clsx';
import React from 'react';
import { WidthClassType } from '../../tailwindTypes';
// import Search from '../Common/Search';
import Sorter, { SortDirection } from '../Common/Sorter';

const HeaderCell: React.FC<{
    width?: WidthClassType;
    key: string;
    direction: SortDirection;
    setDirection: (sorters: SortDirection) => void;
}> = ({ children, width, direction: sorter, setDirection: setSorter }) => {
    return (
        <th className={clsx('px-3 py-2 border', width)} scope='col'>
            <div className='flex flex-col'>
                <div className='flex justify-between items-center'>
                    {children}
                    <Sorter direction={sorter} setDirection={setSorter} />
                </div>
                {/* <Search value={''} onChange={() => {}} /> */}
            </div>
        </th>
    );
};

export default HeaderCell;
