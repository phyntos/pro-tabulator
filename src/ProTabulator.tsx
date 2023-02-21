import { ActionType, ProTable } from '@ant-design/pro-components';
import { FormInstance, SpinProps } from 'antd';
import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';
import ProTabulatorProvider from './components/ProTabulatorProvider';
import useColumns from './hooks/useColumns';
import useDownload from './hooks/useDownload';
import useFilterButton from './hooks/useFilterButton';
import usePagination from './hooks/usePagination';
import useUpload from './hooks/useUpload';
import './pro-tabulator.css';
import useHeightScroll from './services/getHeightScroll';
import getInitialValues from './services/getInitialValues';
import getOrderedData from './services/getOrderedData';
import getRequestParams from './services/getRequestParams';
import TableStorage from './services/TableStorage';
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
    formRef: propFormRef,
    downloadProps,
    disableStorage,
    toolBarRender,
    pagination,
    className,
    options,
    colorPrimary,
    disableHeightScroll,
    onLoadingChange,
    rowKey = 'id',
    uploadProps,
    ...props
}: ProTabulatorProps<DataSource, Params>) => {
    const actionRef = useRef<ActionType>();
    const formRef = useRef<FormInstance<any>>();
    const [loading, setLoading] = useState<boolean | SpinProps>();
    const heightScroll = useHeightScroll(id, loading);

    const tableStorage = useMemo(() => new TableStorage<Params>(id), [id]);
    const storageParams = tableStorage.getFormValues();

    const initialValues = useMemo(
        () => (disableStorage || !id || hiddenFilter ? {} : getInitialValues<DataSource>(columns, storageParams)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useImperativeHandle(propActionRef, () => actionRef.current);
    useImperativeHandle(propFormRef, () => formRef.current);

    const [filterButton, filterList] = useFilterButton({
        columns,
        hiddenFilter,
        tableStorage,
    });

    const proColumns = useColumns({
        columns,
        filterList,
        hiddenFilter,
        ordered,
        rowKey,
    });

    const { downloadRender, onDataSourceChange } = useDownload({
        columns,
        actionRef,
        downloadProps,
        id,
        ordered,
        request,
        tableStorage,
    });

    const { uploadRender } = useUpload<DataSource>({ uploadProps, columns, actionRef });

    const defaultPagination = usePagination<DataSource>({
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
        <ProTabulatorProvider colorPrimary={colorPrimary}>
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
                rowKey={rowKey}
                toolBarRender={(action, rows) => {
                    const toolBarRenders = toolBarRender !== false && toolBarRender ? toolBarRender(action, rows) : [];
                    return toolBarRenders.concat([...downloadRender, ...uploadRender]);
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
                onLoadingChange={(loading) => {
                    setLoading(loading);
                    onLoadingChange?.(loading);
                }}
                scroll={{
                    x: true,
                    y: disableHeightScroll ? undefined : heightScroll,
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
                        onClick: () => rowClick?.(row),
                        style: {
                            cursor: rowClick ? 'pointer' : undefined,
                        },
                    };
                }}
                {...props}
            />
        </ProTabulatorProvider>
    );
};

export default ProTabulator;
