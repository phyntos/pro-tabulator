import { FilterOutlined } from '@ant-design/icons';
import { Space, Checkbox, Popover, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { ProTabulatorProps } from '../ProTabulator';

export type FilterHidden = {
    dataIndex: string;
    title: string;
    hidden: boolean;
    fixed: boolean;
};

const useFilterButton = <
    DataSource extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
>({
    columns,
    hiddenFilter,
}: Pick<ProTabulatorProps<DataSource, Params>, 'columns' | 'hiddenFilter'>) => {
    const [filterHiddens, setFilterHiddens] = useState<FilterHidden[]>([]);

    useEffect(() => {
        setFilterHiddens(
            columns
                .filter((column) => column.filter)
                .map((column) => ({
                    dataIndex: column.dataIndex,
                    title: column.title,
                    hidden: hiddenFilter || column.filter.hidden,
                    fixed: column.filter.fixed,
                })),
        );
    }, [columns, hiddenFilter]);

    const filterList = (
        <Space direction='vertical'>
            {filterHiddens.map((filter) => (
                <Checkbox
                    key={filter.title}
                    checked={!filter.hidden}
                    disabled={filter.fixed}
                    onChange={(event) => {
                        setFilterHiddens((filterHiddens) =>
                            filterHiddens.map((column) => {
                                if (column.dataIndex === filter.dataIndex) {
                                    return {
                                        ...column,
                                        hidden: !event.target.checked,
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
        <Popover key='filter-button' content={filterList} placement='bottomLeft' trigger='click'>
            <Button type='primary' icon={<FilterOutlined />} />
        </Popover>,
        filterHiddens,
    ] as const;
};

export default useFilterButton;
