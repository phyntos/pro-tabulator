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
    useForUpload?: boolean;
} & Omit<ProColumns<DataSource>, 'dataIndex' | 'title' | 'filterMode' | 'valueType'>;

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

export type DownloadColumn = {
    title: any;
    dataIndex: string | string[];
    width?: number;
    excelRender?: (text: any, record: any, index: number) => string | object;
};

export type UploadColumn = {
    title: string;
    dataIndex: string;
};

export type EditableProTabulatorProps<
    DataSource extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
> = ProTabulatorExtraProps<DataSource, Params> &
    Omit<
        EditableProTableProps<DataSource, Params>,
        'columns' | 'request' | 'dataSource' | 'actionRef' | 'formRef' | 'rowKey'
    > & {
        editableProps?: {
            saveAllText?: React.ReactNode;
            createText?: React.ReactNode;
            onSave?: (data: DataSource) => Promise<void>;
            onSaveMultiple?: (data: DataSource[]) => Promise<void>;
            onDelete?: (id: string | number) => Promise<void>;
            onDeleteMultiple?: (ids: (string | number)[]) => Promise<void>;
            onCreate?: () => Promise<string | number>;
            hidden?: {
                create?: boolean;
                saveMultiple?: boolean;
                deleteMultiple?: boolean;
                actions?:
                    | true
                    | {
                          edit?: boolean;
                          delete?: boolean;
                      };
            };
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
    id: string;
    disableStorage?: boolean;
    disableHeightScroll?: boolean;
    downloadProps?: {
        fileName: string;
        excelColumns?: DownloadColumn[];
        extra?: {
            name: string;
            fileName: string;
            excelColumns?: DownloadColumn[];
            params?: ProTabulatorRequestParams<Params>;
        }[];
    };
    uploadProps?: {
        columns?: UploadColumn[];
        ordered?: boolean;
        onUpload: (data: DataSource[]) => Promise<void>;
    };
    colorPrimary?: string;
    rowKey?: string;
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
    Omit<ProTableProps<DataSource, Params>, 'columns' | 'request' | 'dataSource' | 'actionRef' | 'formRef' | 'rowKey'>;

export type ProTabulatorDataSource<T extends Record<string, any>> = T & { orderNumber?: number };
