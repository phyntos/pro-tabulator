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
};

type RequestType<DataType> = { data: DataType[]; total: number };

export type SorterType<DataType> = {
    key?: Extract<keyof DataType, string>;
    direction: SortDirection;
};

type TableBaseProps<DataType> = {
    columns: TableColumnType<DataType>[];
    rowKey: Extract<keyof DataType, string>;
    pagination?: Partial<PaginationType>;
    color?: ColorType;
};

type TableSourceProps<DataType> = TableBaseProps<DataType> & {
    type: 'local';
    dataSource: DataType[];
};

type TableRequestProps<DataType> = TableBaseProps<DataType> & {
    type: 'remote';
    dataSource: (params: PaginationType, sorter: SorterType<DataType>) => Promise<RequestType<DataType>>;
};

type TableProps<DataType> = TableSourceProps<DataType> | TableRequestProps<DataType>;

export const getPaginatedData = <T,>(data: T[], { pageSize, current }: PaginationType): T[] => {
    const lastIndex = current * pageSize;
    const total = data.length;
    const lastItemIndex = lastIndex < total ? lastIndex : total;
    const firstItemIndex = lastIndex - pageSize;
    return data.slice(firstItemIndex, lastItemIndex);
};

const Table = <DataType,>({
    columns,
    rowKey,
    pagination: defaultPagination,
    type,
    dataSource,
    color = 'indigo',
}: TableProps<DataType>) => {
    const [sorter, setSorter] = useState<SorterType<DataType>>({ direction: 'none' });
    const [currentData, setCurrentData] = useState<DataType[]>([]);
    const [pagination, setPagination] = useState<PaginationType>({
        pageSize: 10,
        current: 1,
        ...defaultPagination,
    });
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // console.log('RELOADED');

    useEffect(() => {
        if (type === 'local') {
            setCurrentData(getPaginatedData(dataSource, pagination));
            setTotal(dataSource.length);
        }
        if (type === 'remote') {
            setLoading(true);
            dataSource(pagination, sorter)
                .then(({ data, total }) => {
                    setCurrentData(data);
                    setTotal(total);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [pagination, type, dataSource, sorter]);

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
                                        width={column.width}
                                        key={column.key}
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
