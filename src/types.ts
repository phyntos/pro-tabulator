import { ActionType, ProTableProps } from '@ant-design/pro-components';
import { OptionConfig } from '@ant-design/pro-table/es/components/ToolBar';
import { TablePaginationConfig } from 'antd';

// eslint-disable-next-line @typescript-eslint/ban-types
type KeyOfWithString<DataSource extends Record<string, any>> = (string & {}) | Extract<keyof DataSource, string>;

export type ProTabulatorSelectOptionType = {
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
};

export type ProTabulatorColumn<DataSource extends Record<string, any>> = {
    title: string;
    excelTitle?: string;
    dataIndex: KeyOfWithString<DataSource>;
    hidden?: boolean;
    width?: number | string;
    request?: () => Promise<ProTabulatorSelectOptionType[]>;
    valueEnum?: Record<string, string | number | boolean>;
    options?: ProTabulatorSelectOptionType[];
    valueType?: 'select' | 'text' | 'date';
    sorter?: boolean;
    filterMode?: 'visible' | 'hidden' | 'fixed';
    filterProps?: {
        multiple?: boolean;
        dateFormat?: string;
    };
    showInExcel?: boolean;
    excelRender?: (text: string, record: DataSource, index: number) => string | object;
    ellipsis?: boolean;
};

export type ProTabulatorRequestParams<Params extends Record<string, any> = Record<string, any>> = Partial<Params> & {
    pageSize?: number;
    current?: number;
    keyword?: string;
    orderBy?: string;
};

export type ProTabulatorRequest<
    DataSource extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
> = (params: ProTabulatorRequestParams<Params>) => Promise<{
    data: DataSource[];
    total: number;
}>;

export type AntProExcelColumn = {
    title: any;
    dataIndex: string | string[];
    width?: number;
    excelRender?: (text: any, record: any, index: number) => string | object;
};

export type ProTabulatorProps<
    DataSource extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
> = {
    columns: ProTabulatorColumn<ProTabulatorDataSource<DataSource>>[];
    hiddenFilter?: boolean;
    rowClick?: (row: ProTabulatorDataSource<DataSource>) => void;
    ordered?: boolean;
    actionRef?: React.MutableRefObject<ActionType | undefined>;
    id?: string;
    disableStorage?: boolean;
    excelDownload?: {
        fileName: string;
        excelColumns?: AntProExcelColumn[];
        extra?: {
            name: string;
            fileName: string;
            excelColumns?: AntProExcelColumn[];
            params?: ProTabulatorRequestParams<Params>;
        }[];
    };
    toolBarRender?: ProTableProps<DataSource, any>['toolBarRender'];
    pagination?: false | TablePaginationConfig;
    className?: string;
    options?: false | OptionConfig;
    colorPrimary?: string;
} & (
    | {
          dataSource: ProTabulatorDataSource<DataSource>[];
          request?: undefined;
      }
    | {
          dataSource?: undefined;
          request: ProTabulatorRequest<ProTabulatorDataSource<DataSource>, Params>;
      }
);

export type ProTabulatorDataSource<T extends Record<string, any>> = T & { order?: number };
