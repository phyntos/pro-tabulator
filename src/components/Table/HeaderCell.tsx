import clsx from 'clsx';
import React from 'react';
import { SortDirection, TableColumnType } from '../../types/table';
import Search from '../Common/Search';
import Sorter from '../Common/Sorter';

const HeaderCell: React.FC<{
    index: number;
    column: TableColumnType<any>;
    filter?: Record<string, any>;
    setFilter?: (filter?: Record<string, any>) => void;
    direction: SortDirection;
    setDirection: (sorters: SortDirection) => void;
}> = ({ children, column, direction, setDirection, filter, setFilter, index }) => {
    return (
        <th
            className={clsx('px-3 py-2 border relative')}
            scope='col'
            style={{ maxWidth: column.width, width: column.width, minWidth: 84 }}
        >
            <div className='flex justify-between items-center gap-1'>
                <div
                    className='overflow-hidden text-ellipsis whitespace-nowrap'
                    style={{ maxWidth: 'calc(100% - 36px)' }}
                    title={String(children)}
                >
                    {children}
                </div>
                <div className='flex gap-1 items-center'>
                    {column.filter === 'text' && (
                        <Search
                            index={index}
                            value={filter[column.key]}
                            onChange={(value: string) => {
                                setFilter({ [column.key]: value });
                            }}
                        />
                    )}
                    <Sorter direction={direction} setDirection={setDirection} />
                </div>
            </div>
        </th>
    );
};

export default HeaderCell;
