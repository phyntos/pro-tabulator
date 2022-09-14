import ProTable, { ActionType, ProTableProps } from '@ant-design/pro-table';
import { ConfigProvider } from 'antd';
import ru_RU from 'antd/lib/locale-provider/ru_RU';
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AxiosParamsType, IObject, ProTabulatorProps } from '../../types';
// Styles
import useProColumns from '../../hooks/useProColumns';
import useProScroll from '../../hooks/useProScroll';
import { getStorageValues, translateParams } from '../../services';
import './ProTabulator.less';

const ProTabulator = <DataType extends IObject, Params extends Record<string, any> = Record<string, any>>({
    persistenceType,
    request,
    numbered,
    tabulatorID,
    columns: propColumns,
    actionRef: propActionRef,
    defaultPageSize = 10,
    primaryColor,
    rowKey = 'id',
    onRowClick,
    rowClassName,
    params: propParams,
}: ProTabulatorProps<DataType, Params>) => {
    const actionRef = useRef<ActionType>();
    useImperativeHandle(propActionRef, () => actionRef.current);
    // const [total, setTotal] = useState<number>(0);
    const [axiosParams, setAxiosParams] = useState<AxiosParamsType<Params>>({} as AxiosParamsType<Params>);
    const [loading, setLoading] = useState<boolean>();

    const storageParams = getStorageValues<Params>(tabulatorID, persistenceType);
    const [params, setParams] = useState<Params>({ ...storageParams, ...propParams });
    const updateParams = useCallback((obj: IObject) => {
        setParams((params) => ({ ...params, ...obj }));
    }, []);
    const { columns, columnsLoading } = useProColumns({
        columns: propColumns,
        params,
        updateParams,
        numbered,
    });

    const scroll = useProScroll(tabulatorID, loading);

    useEffect(() => {
        if (persistenceType) {
            window[persistenceType].setItem(tabulatorID + '_AxiosParams', JSON.stringify(axiosParams));
        }
    }, [persistenceType, axiosParams, tabulatorID]);

    ConfigProvider.config({
        prefixCls: 'tabulator',
        theme: {
            primaryColor,
        },
    });

    const tableRequest: ProTableProps<DataType, Params>['request'] = async (params, sorter, filter) => {
        const axiosParams = translateParams<DataType, Params>(params, sorter, filter);
        setAxiosParams(axiosParams);
        const response = await request(axiosParams);
        let { data } = response;
        const { current, pageSize } = params;
        if (numbered) {
            data = data.map((item, index) => {
                if (current && pageSize) {
                    const numberedIndex = (current - 1) * pageSize + index + 1;
                    return { ...item, numberedIndex };
                }
                return item;
            });
        }
        // setTotal(response.total);
        return { data, success: true, total: response.total };
    };

    return (
        <ConfigProvider locale={ru_RU} prefixCls='tabulator'>
            <ProTable<DataType, Params>
                className={tabulatorID}
                request={tableRequest}
                columns={columns}
                rowKey={rowKey}
                actionRef={actionRef}
                params={params}
                options={{
                    density: false,
                }}
                loading={loading === undefined ? undefined : loading || columnsLoading}
                onLoadingChange={(changedLoading) => {
                    setLoading(typeof changedLoading === 'boolean' ? changedLoading : changedLoading.spinning);
                }}
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
