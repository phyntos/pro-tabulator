import { StyleProvider } from '@ant-design/cssinjs';
import { ProTable } from '@ant-design/pro-components';
import { ConfigProvider, SpinProps } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import ruRU from 'antd/locale/ru_RU';
import React, { useState } from 'react';
import useHeightScroll from './functions/getHeightScroll';
import useColumns from './hooks/useColumns';
import useFilterButton from './hooks/useFilterButton';
import './pro-tabulator.css';

// eslint-disable-next-line @typescript-eslint/ban-types
type KeyOfWithString<DataSource extends Record<string, any>> = (string & {}) | Extract<keyof DataSource, string>;

export type ProTabulatorSelectOptionType = {
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
};

type ProTabulatorPropsColumn<DataSource extends Record<string, any>> = {
    title: string;
    dataIndex: KeyOfWithString<DataSource>;
    hidden?: boolean;
    width?: number | string;
    request?: () => Promise<ProTabulatorSelectOptionType[]>;
    valueEnum?: Record<string, string | number | boolean>;
    options?: ProTabulatorSelectOptionType[];
    valueType?: 'select' | 'text' | 'date';
    filterMode?: 'visible' | 'hidden' | 'fixed';
    filterProps?: {
        multiple?: boolean;
        dateFormat?: string;
    };
};

export type ProTabulatorRequestParams<Params extends Record<string, any> = Record<string, any>> = Partial<Params> & {
    pageSize?: number;
    current?: number;
    keyword?: string;
};

type ProTabulatorRequest<
    DataSource extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
> = (
    params: ProTabulatorRequestParams<Params>,
    sorter: Record<string, SortOrder>,
) => Promise<{
    data: DataSource[];
    total: number;
}>;

export type ProTabulatorProps<
    DataSource extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
> = {
    columns: ProTabulatorPropsColumn<DataSource>[];
    hiddenFilter?: boolean;
    rowClick?: (row: DataSource) => void;
    ordered?: boolean;
    id?: string;
} & (
    | {
          dataSource: DataSource[];
          request?: undefined;
      }
    | {
          dataSource?: undefined;
          request: ProTabulatorRequest<DataSource, Params>;
      }
);

type ProTabulatorDataSource<T extends Record<string, any>> = T & { order?: number };

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
}: ProTabulatorProps<ProTabulatorDataSource<DataSource>, Params>) => {
    const [loading, setLoading] = useState<boolean | SpinProps>();
    const heightScroll = useHeightScroll(id, loading);
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
                <ProTable<ProTabulatorDataSource<DataSource>, ProTabulatorRequestParams<Params>>
                    dataSource={dataSource}
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
