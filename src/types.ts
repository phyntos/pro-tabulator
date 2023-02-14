import { ActionType } from '@ant-design/pro-components';
import { SortOrder } from 'antd/es/table/interface';

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
};

export type ProTabulatorRequestParams<Params extends Record<string, any> = Record<string, any>> = Partial<Params> & {
    pageSize?: number;
    current?: number;
    keyword?: string;
};

export type ProTabulatorRequest<
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
    columns: ProTabulatorColumn<ProTabulatorDataSource<DataSource>>[];
    hiddenFilter?: boolean;
    rowClick?: (row: ProTabulatorDataSource<DataSource>) => void;
    ordered?: boolean;
    id?: string;
    actionRef?: React.Ref<ActionType | undefined>;
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
