import React, { useState } from 'react';
import Table, { getPaginatedData, SorterType, TableColumnType } from '../components/Table/Table';
import { ColorType } from '../contexts/ColorContext';

type DataType = {
    id: number;
    name: string;
    description: string;
};

const dataCreator = (length: number) => {
    const data: DataType[] = [];
    for (let i = 0; i < length; i++) {
        data.push({
            id: i + 1,
            name: (Math.random() + 1).toString(36).substring(7),
            description: (Math.random() + 1).toString(36).substring(2),
        });
    }
    return data;
};

export const getSortedData = (data: DataType[], sorter: SorterType<DataType>) => {
    return [...data].sort((a, b) => {
        switch (sorter.key) {
            case 'id':
                if (sorter.direction === 'asc') {
                    return a[sorter.key] - b[sorter.key];
                }
                if (sorter.direction === 'desc') {
                    return b[sorter.key] - a[sorter.key];
                }
                break;
            case 'name':
            case 'description':
                if (sorter.direction === 'asc') {
                    return a[sorter.key].localeCompare(b[sorter.key]);
                }
                if (sorter.direction === 'desc') {
                    return b[sorter.key].localeCompare(a[sorter.key]);
                }
                break;
        }
        return 0;
    });
};

const DevTabulator = () => {
    const [color, setColor] = useState<ColorType>('indigo');
    const columns: TableColumnType<DataType>[] = [
        {
            key: 'id',
            title: 'ID',
            width: 'w-1/5',
        },
        {
            key: 'name',
            title: 'Name',
            width: 'w-1/2',
        },
        {
            key: 'description',
            title: 'Description',
        },
    ];
    const data = dataCreator(190);

    return (
        <div className='p-5'>
            <Table<DataType>
                rowKey='id'
                type='remote'
                columns={columns}
                dataSource={async (params, sorters) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve({
                                data: getPaginatedData(getSortedData(data, sorters), params),
                                total: data.length,
                            });
                        }, 500);
                    });
                }}
                pagination={{
                    pageSize: 10,
                    current: 1,
                }}
                color={color}
            />
            <div className='flex gap-8'>
                <div className='cursor-pointer text-indigo-500' onClick={() => setColor('indigo')}>
                    indigo
                </div>
                <div className='cursor-pointer text-blue-500' onClick={() => setColor('blue')}>
                    blue
                </div>
            </div>
        </div>
    );
};

export default DevTabulator;
