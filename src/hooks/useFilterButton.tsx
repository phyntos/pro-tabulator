import { FilterOutlined } from '@ant-design/icons';
import { Space, Checkbox, Popover, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import TableStorage from '../services/TableStorage';
import { ProTabulatorProps } from '../types';

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
    hideColumns,
    tableStorage,
}: Pick<ProTabulatorProps<DataSource, Params>, 'columns' | 'hiddenFilter' | 'hideColumns'> & {
    tableStorage: TableStorage<Params>;
}) => {
    const [filterList, setFilterList] = useState<FilterHidden[]>([]);

    useEffect(() => {
        if (hiddenFilter) {
            setFilterList([]);
        } else {
            const storageParams = tableStorage.getFormValues();
            setFilterList((prev) =>
                columns
                    .filter(
                        (column) =>
                            column.valueType &&
                            column.valueType !== 'option' &&
                            (typeof column.hideInSearch !== 'undefined'
                                ? !column.hideInSearch
                                : !(hideColumns || []).includes(column.dataIndex)),
                    )
                    .map<FilterHidden>((column) => {
                        const filterMode = prev.find((x) => x.dataIndex == column.dataIndex)?.filterMode;

                        return {
                            dataIndex: column.dataIndex,
                            title: column.title,
                            filterMode:
                                typeof filterMode !== 'undefined'
                                    ? filterMode
                                    : column.searchState === 'hidden' && column.dataIndex in storageParams
                                    ? 'visible'
                                    : column.searchState,
                        };
                    }),
            );
        }
    }, [columns, hiddenFilter, tableStorage, hideColumns]);

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
