import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import ColorContext, { ColorType } from '../../contexts/ColorContext';
import { WidthClassType } from '../../tailwindTypes';
import { SortDirection } from '../Common/Sorter';
import Spinner from '../Common/Spinner';
import Pagination, { PaginationType } from '../Pagination/Pagination';
import Cell from './Cell';
import HeaderCell from './HeaderCell';
import Row from './Row';

export type TableColumnType<DataType> = {
    title: string;
    key: Extract<keyof DataType, string>;
    width?: WidthClassType;
    filter?: ColumnFilterType;
};

type RequestType<DataType> = { data: DataType[]; total: number };
export type ColumnFilterType = 'number' | 'text';

export type SorterType<DataType> = {
    key?: Extract<keyof DataType, string>;
    direction: SortDirection;
};

type TableBaseProps<DataType, DataTypeFilter> = {
    columns: TableColumnType<DataType>[];
    rowKey: Extract<keyof DataType, string>;
    pagination?: Partial<PaginationType>;
    color?: ColorType;
    filter?: DataTypeFilter;
};

type TableSourceProps<DataType> = {
    type: 'local';
    dataSource: DataType[];
};

type TableRequestProps<DataType, DataTypeFilter> = {
    type: 'remote';
    dataSource: (
        pagination: PaginationType,
        sorter: SorterType<DataType>,
        filter: DataTypeFilter,
    ) => Promise<RequestType<DataType>>;
};

type TableProps<DataType, DataTypeFilter> = TableBaseProps<DataType, DataTypeFilter> &
    (TableSourceProps<DataType> | TableRequestProps<DataType, DataTypeFilter>);

export const getPaginatedData = <T,>(data: T[], { pageSize, current }: PaginationType): T[] => {
    const lastIndex = current * pageSize;
    const total = data.length;
    const lastItemIndex = lastIndex < total ? lastIndex : total;
    const firstItemIndex = lastIndex - pageSize;
    return data.slice(firstItemIndex, lastItemIndex);
};

const Table = <DataType extends Record<string, any>, DataTypeFilter extends Record<string, any> = Record<string, any>>({
    columns,
    rowKey,
    pagination: defaultPagination,
    type,
    dataSource,
    color = 'indigo',
    filter: defaultFilter,
}: TableProps<DataType, DataTypeFilter>) => {
    const [sorter, setSorter] = useState<SorterType<DataType>>({ direction: 'none' });
    const [currentData, setCurrentData] = useState<DataType[]>([]);
    const [pagination, setPagination] = useState<PaginationType>({ pageSize: 10, current: 1 });
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<DataTypeFilter>({} as DataTypeFilter);

    // console.log('RELOADED');
    useEffect(() => {
        setFilter((filter) => ({ ...filter, ...defaultFilter }));
    }, [defaultFilter]);

    useEffect(() => {
        setPagination((pagination) => ({ ...pagination, ...defaultPagination }));
    }, [defaultPagination]);

    useEffect(() => {
        if (type === 'local') {
            setCurrentData(getPaginatedData(dataSource, pagination));
            setTotal(dataSource.length);
        }
        if (type === 'remote') {
            setLoading(true);
            dataSource(pagination, sorter, filter)
                .then(({ data, total }) => {
                    setCurrentData(data);
                    setTotal(total);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [pagination, type, dataSource, sorter, filter]);

    return (
        <ColorContext.Provider value={color}>
            <div className='relative'>
                <div
                    className={clsx(
                        loading ? 'absolute' : 'hidden',
                        'bg-[#FFFFFFAA] flex justify-center items-center z-20 w-full h-full',
                    )}
                >
                    <Spinner />
                </div>
                <table className='table-auto w-full text-sm text-left text-gray-500'>
                    <thead className='text-xs text-gray-700 bg-gray-50'>
                        <tr>
                            {columns.map((column) => {
                                let direction: SortDirection = 'none';
                                if (sorter.key === column.key) {
                                    direction = sorter.direction;
                                }
                                return (
                                    <HeaderCell
                                        column={column}
                                        key={'head_' + column.key}
                                        filter={filter}
                                        setFilter={(filter) =>
                                            setFilter((prevFilter) => ({ ...prevFilter, ...filter }))
                                        }
                                        direction={direction}
                                        setDirection={(direction) => setSorter({ key: column.key, direction })}
                                    >
                                        {column.title}
                                    </HeaderCell>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item) => {
                            const rowKeyData = String(item[rowKey]);
                            return (
                                <Row key={rowKeyData}>
                                    {columns.map((column) => (
                                        <Cell key={rowKeyData + column.key}>{item[column.key]}</Cell>
                                    ))}
                                </Row>
                            );
                        })}
                    </tbody>
                </table>
                <Pagination total={total} pagination={pagination} setPagination={setPagination} />
            </div>
        </ColorContext.Provider>
    );
};

export default Table;
