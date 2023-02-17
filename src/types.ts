import { ActionType, ProColumns, ProTableProps } from '@ant-design/pro-components';
import { EditableProTableProps } from '@ant-design/pro-table/es/components/EditableTable';
import { FormInstance } from 'antd';

// eslint-disable-next-line @typescript-eslint/ban-types
type KeyOfWithString<DataSource extends Record<string, any>> = (string & {}) | Extract<keyof DataSource, string>;

export type ProTabulatorSelectOptionType = {
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
};

export type ProTabulatorColumn<DataSource extends Record<string, any>> = {
    title: string;
    dataIndex: KeyOfWithString<DataSource>;
    searchState?: 'visible' | 'hidden' | 'fixed';
    excelTitle?: string;
    showInExcel?: boolean;
    excelRender?: (text: string, record: DataSource, index: number) => string | object;
    valueType?: ProColumns<DataSource>['valueType'] | 'dateApartRange';
} & Omit<ProColumns<DataSource>, 'hideInSearch' | 'dataIndex' | 'title' | 'filterMode' | 'valueType'>;

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

export type EditableProTabulatorProps<
    DataSource extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
> = ProTabulatorExtraProps<DataSource, Params> &
    Omit<EditableProTableProps<DataSource, Params>, 'columns' | 'request' | 'dataSource' | 'actionRef' | 'formRef'> & {
        editableProps?: {
            saveAllText?: React.ReactNode;
            createText?: React.ReactNode;
            onSave?: (data: DataSource) => Promise<void>;
            onSaveMultiple?: (data: DataSource[]) => Promise<void>;
            onDelete?: (id: string) => Promise<void>;
            onCreate?: () => Promise<void>;
        };
    };

export type ProTabulatorExtraProps<
    DataSource extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
> = {
    columns: ProTabulatorColumn<ProTabulatorDataSource<DataSource>>[];
    hiddenFilter?: boolean;
    rowClick?: (row: ProTabulatorDataSource<DataSource>) => void;
    ordered?: boolean;
    actionRef?: React.MutableRefObject<ActionType | undefined>;
    formRef?: React.MutableRefObject<FormInstance<any>>;
    id?: string;
    disableStorage?: boolean;
    disableHeightScroll?: boolean;
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

export type ProTabulatorProps<
    DataSource extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
> = ProTabulatorExtraProps<DataSource, Params> &
    Omit<ProTableProps<DataSource, Params>, 'columns' | 'request' | 'dataSource' | 'actionRef' | 'formRef'>;

export type ProTabulatorDataSource<T extends Record<string, any>> = T & { order?: number };
