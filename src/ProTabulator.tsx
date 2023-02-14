import { StyleProvider } from '@ant-design/cssinjs';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { ConfigProvider, SpinProps } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import React, { useImperativeHandle, useRef, useState } from 'react';
import useHeightScroll from './functions/getHeightScroll';
import useColumns from './hooks/useColumns';
import useFilterButton from './hooks/useFilterButton';
import './pro-tabulator.css';
import { ProTabulatorProps } from './types';

const ProTabulator = <
    DataSource extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
>({
    columns,
    hiddenFilter,
    dataSource,
    request,
    rowClick,
    ordered,
    id,
    actionRef: propActionRef,
}: ProTabulatorProps<DataSource, Params>) => {
    const actionRef = useRef<ActionType>();
    const [loading, setLoading] = useState<boolean | SpinProps>();
    const heightScroll = useHeightScroll(id, loading);

    useImperativeHandle(propActionRef, () => actionRef.current);

    const [filterButton, filterList] = useFilterButton({
        columns,
        hiddenFilter,
    });

    const proColumns = useColumns({
        columns,
        filterList,
        hiddenFilter,
        ordered,
    });

    return (
        <StyleProvider hashPriority='high'>
            <ConfigProvider
                locale={ruRU}
                theme={{
                    token: {
                        // colorPrimary: 'blue',
                    },
                }}
                prefixCls='tabulator'
                iconPrefixCls='tabulator-icon'
            >
                <ProTable<DataSource, Params>
                    dataSource={dataSource}
                    actionRef={actionRef}
                    request={async (params, sorter) => {
                        let response = await request(params, sorter);
                        if (ordered) {
                            response = {
                                ...response,
                                data: response.data.map((item, index) => {
                                    item.order = ((params.current || 1) - 1) * (params.pageSize || 10) + index + 1;
                                    return item;
                                }),
                            };
                        }
                        return response;
                    }}
                    pagination={{
                        showSizeChanger: true,
                        defaultPageSize: 10,
                        size: 'small',
                        defaultCurrent: 1,
                        locale: {
                            items_per_page: '/ записей',
                        },
                        showTotal: (total: number) => `Всего: ${total} записей`,
                    }}
                    bordered
                    size='middle'
                    toolbar={{
                        title: hiddenFilter || !filterList.length ? undefined : filterButton,
                    }}
                    className='pro-tabulator'
                    onLoadingChange={setLoading}
                    tableRender={(tableProps, defaultDom, domList) => {
                        return (
                            <>
                                {domList.alert}
                                {domList.toolbar}
                                {domList.table}
                            </>
                        );
                    }}
                    scroll={{
                        x: true,
                        y: heightScroll,
                    }}
                    columns={proColumns}
                    search={{
                        filterType: 'light',
                    }}
                    options={{
                        density: false,
                        reload: true,
                        setting: false,
                    }}
                    onRow={(row) => {
                        return {
                            onClick: () => rowClick(row),
                        };
                    }}
                />
            </ConfigProvider>
        </StyleProvider>
    );
};

export default ProTabulator;
