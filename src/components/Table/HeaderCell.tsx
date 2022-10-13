import clsx from 'clsx';
import React from 'react';
import Search from '../Common/Search';
import Sorter, { SortDirection } from '../Common/Sorter';
import { TableColumnType } from './Table';

const HeaderCell: React.FC<{
    column: TableColumnType<any>;
    filter?: Record<string, any>;
    setFilter?: (filter?: Record<string, any>) => void;
    direction: SortDirection;
    setDirection: (sorters: SortDirection) => void;
}> = ({ children, column, direction, setDirection, filter, setFilter }) => {
    return (
        <th className={clsx('px-3 py-2 border relative', column.width)} scope='col'>
            <div className='flex flex-col'>
                <div className='flex justify-between items-center'>
                    {children}
                    <div className='flex gap-1 items-center'>
                        {column.filter === 'text' && (
                            <Search
                                value={filter[column.key]}
                                onChange={(value: string) => {
                                    setFilter({ [column.key]: value });
                                }}
                            />
                        )}
                        <Sorter direction={direction} setDirection={setDirection} />
                    </div>
                </div>
            </div>
        </th>
    );
};

export default HeaderCell;
