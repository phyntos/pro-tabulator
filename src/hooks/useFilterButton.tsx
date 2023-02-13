import { FilterOutlined } from '@ant-design/icons';
import { Space, Checkbox, Popover, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { ProTabulatorProps } from '../ProTabulator';

export type FilterHidden = {
    dataIndex: string;
    title: string;
    filterMode?: 'visible' | 'hidden' | 'fixed';
};

const useFilterButton = <
    DataSource extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
>({
    columns,
    hiddenFilter,
}: Pick<ProTabulatorProps<DataSource, Params>, 'columns' | 'hiddenFilter'>) => {
    const [filterList, setFilterList] = useState<FilterHidden[]>([]);

    useEffect(() => {
        if (hiddenFilter) {
            setFilterList([]);
        } else {
            setFilterList(
                columns
                    .filter((column) => column.valueType)
                    .map<FilterHidden>((column) => ({
                        dataIndex: column.dataIndex,
                        title: column.title,
                        filterMode: column.filterMode,
                    })),
            );
        }
    }, [columns, hiddenFilter]);

    const filterContent = (
        <Space direction='vertical'>
            {filterList.map((filter) => (
                <Checkbox
                    key={filter.title}
                    checked={filter.filterMode !== 'hidden'}
                    disabled={filter.filterMode === 'fixed'}
                    onChange={(event) => {
                        setFilterList((filterHiddens) =>
                            filterHiddens.map<FilterHidden>((column) => {
                                if (column.dataIndex === filter.dataIndex) {
                                    return {
                                        ...column,
                                        filterMode: event.target.checked ? 'visible' : 'hidden',
                                    };
                                }
                                return column;
                            }),
                        );
                    }}
                >
                    {filter.title}
                </Checkbox>
            ))}
        </Space>
    );

    return [
        <Popover key='filter-button' content={filterContent} placement='bottomLeft' trigger='click'>
            <Button type='primary' icon={<FilterOutlined />} />
        </Popover>,
        filterList,
    ] as const;
};

export default useFilterButton;
