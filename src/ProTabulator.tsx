import { StyleProvider } from '@ant-design/cssinjs';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { ConfigProvider, SpinProps } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';
import useHeightScroll from './services/getHeightScroll';
import useColumns from './hooks/useColumns';
import useFilterButton from './hooks/useFilterButton';
import './pro-tabulator.css';
import { ProTabulatorProps } from './types';
import getOrderedData from './services/getOrderedData';
import useDownload from './hooks/useDownload';
import TableStorage from './services/TableStorage';
import getInitialValues from './services/getInitialValues';
import getRequestParams from './services/getRequestParams';
import useTablePagination from './hooks/useTablePagination';

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
    excelDownload,
    disableStorage,
    toolBarRender,
    pagination,
    className,
    options,
}: ProTabulatorProps<DataSource, Params>) => {
    const actionRef = useRef<ActionType>();
    const [loading, setLoading] = useState<boolean | SpinProps>();
    const heightScroll = useHeightScroll(id, loading);

    const tableStorage = useMemo(() => new TableStorage<Params>(id), [id]);
    const storageParams = tableStorage.getFormValues();

    const initialValues = useMemo(
        () => (disableStorage || !id || hiddenFilter ? {} : getInitialValues<DataSource>(columns, storageParams)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    console.log(initialValues);

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

    const { downloadRender, onDataSourceChange } = useDownload({
        columns,
        actionRef,
        excelDownload,
        id,
        ordered,
        request,
        tableStorage,
    });

    const defaultPagination = useTablePagination<DataSource>({
        id,
        pagination,
        actionRef,
        tableStorage,
        disableStorage,
    });
    // actionRef.current.
    const classNames = ['pro-tabulator'];
    if (className) classNames.push(className);
    if (id) classNames.push(id);

    return (
        <StyleProvider hashPriority='high'>
            <ConfigProvider
                locale={ruRU}
                theme={{
                    token: {
                        // colorPrimary: 'blue',
                    },
                }}
                prefixCls='pro-tabulator'
                iconPrefixCls='pro-tabulator-icon'
            >
                <ProTable<DataSource, Params>
                    dataSource={dataSource}
                    actionRef={actionRef}
                    request={async (params, sorter) => {
                        const requestParams = getRequestParams<Params>(params, sorter);
                        if (tableStorage && !disableStorage) {
                            tableStorage.setParams(requestParams);
                        }
                        const response = await request(requestParams);
                        const { total } = response;
                        let { data } = response;
                        if (total && tableStorage && !disableStorage) tableStorage.setTotal(total);
                        if (ordered) {
                            data = getOrderedData(data, params.current, params.pageSize);
                        }
                        return {
                            data,
                            total,
                        };
                    }}
                    toolBarRender={(action, rows) => {
                        const toolBarRenders =
                            toolBarRender !== false && toolBarRender ? toolBarRender(action, rows) : [];
                        return toolBarRenders.concat(downloadRender);
                    }}
                    form={{ initialValues }}
                    onDataSourceChange={onDataSourceChange}
                    pagination={defaultPagination}
                    bordered
                    size='middle'
                    toolbar={{
                        title: hiddenFilter || !filterList.length ? undefined : filterButton,
                    }}
                    className={classNames.join(' ')}
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
                    options={
                        options !== false
                            ? {
                                  density: false,
                                  reload: true,
                                  setting: false,
                                  ...options,
                              }
                            : false
                    }
                    dateFormatter='string'
                    onRow={(row) => {
                        return {
                            onClick: () => rowClick(row),
                            style: {
                                cursor: rowClick ? 'pointer' : undefined,
                            },
                        };
                    }}
                />
            </ConfigProvider>
        </StyleProvider>
    );
};

export default ProTabulator;
