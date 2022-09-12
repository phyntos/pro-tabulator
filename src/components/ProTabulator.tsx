import React from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { ConfigProvider, SpinProps } from 'antd';
import ru_RU from 'antd/lib/locale-provider/ru_RU';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import useRequest from '../hooks/useRequest';
import { AxiosParamsType, IObject, ProTabulatorProps } from '../types';
import { translateColumns, columnCreator } from '../services';
// Styles
import useProScroll from '../hooks/useProScroll';
import './ProTabulator.less';

const ProTabulator = <DataType extends IObject, Params extends IObject = IObject>({
    persistenceType,
    request: propRequest,
    numbered,
    tabulatorID,
    columns: propColumns,
    actionRef: propActionRef,
    defaultPageSize = 10,
    primaryColor,
    rowKey = 'id',
    onRowClick,
    rowClassName,
}: ProTabulatorProps<DataType, Params>) => {
    const getCol = columnCreator<DataType, Params>();
    const actionRef = useRef<ActionType>();
    useImperativeHandle(propActionRef, () => actionRef.current);
    // const [total, setTotal] = useState<number>(0);
    const [axiosParams, setAxiosParams] = useState<AxiosParamsType<Params>>({
        pageSize: 10,
        current: 1,
        keyword: '',
        orderBy: 'ad',
    } as AxiosParamsType<Params>);
    const [loading, setLoading] = useState<boolean | SpinProps>();
    const [columnsLoading, setColumnsLoading] = useState<boolean>(false);

    const [params, setParams] = useState<Params>({} as Params);
    const [columns, setColumns] = useState<ProColumns<DataType>[]>([]);

    const scroll = useProScroll(tabulatorID, loading === true ? true : false);

    // console.log(total);

    useEffect(() => {
        console.log('columns', columns);
    }, [columns]);

    useEffect(() => {
        translateColumns({
            columns: typeof propColumns === 'function' ? propColumns(getCol) : propColumns,
            setParams,
            params: { ...params, ...axiosParams },
            tabulatorID,
            persistenceType,
            setLoading: setColumnsLoading,
        }).then(setColumns);
    }, [persistenceType, tabulatorID, propColumns]);

    useEffect(() => {
        if (persistenceType) {
            window[persistenceType].setItem(tabulatorID + '_AxiosParams', JSON.stringify(axiosParams));
        }
    }, [persistenceType, axiosParams, tabulatorID]);

    const request = useRequest<DataType, Params>({
        request: propRequest,
        setAxiosParams,
        setTotal: () => {
            console.log('');
        },
        numbered,
    });

    ConfigProvider.config({
        prefixCls: 'tabulator',
        theme: {
            primaryColor,
        },
    });

    return (
        <ConfigProvider locale={ru_RU} prefixCls='tabulator'>
            <ProTable<DataType, Params>
                className={tabulatorID}
                request={request}
                columns={columns}
                rowKey={rowKey}
                actionRef={actionRef}
                params={params}
                loading={loading === undefined ? undefined : loading || columnsLoading}
                onLoadingChange={setLoading}
                search={false}
                columnsState={{
                    persistenceType,
                    persistenceKey: tabulatorID + '_ColumnsState',
                }}
                onRow={(row) => ({
                    onClick: () => onRowClick?.(row),
                })}
                rowClassName={rowClassName}
                bordered
                size='small'
                scroll={scroll}
                showSorterTooltip={false}
                dateFormatter='string'
                pagination={{
                    defaultPageSize,
                    showSizeChanger: true,
                    size: 'small',
                    defaultCurrent: 1,
                    locale: { items_per_page: '/ записей' },
                    showTotal: (total) => `Всего: ${total} записей`,
                }}
            />
        </ConfigProvider>
    );
};

export default ProTabulator;
