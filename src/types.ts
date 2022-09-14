import { ActionType } from '@ant-design/pro-table';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IObject = Record<string, any>;

export type AxiosParamsType<Params> = Params & {
    pageSize?: number;
    current?: number;
    keyword?: string;
    orderBy?: string;
};

export type ProColumnCreatorFunc<DataType extends IObject, Params extends IObject = IObject> = (
    dataIndex: ProTabulatorColumns<DataType, Params>['dataIndex'],
    title: ProTabulatorColumns<DataType, Params>['title'],
    search?: ProTabulatorColumns<DataType, Params>['search'],
    options?: Omit<ProTabulatorColumns<DataType, Params>, 'dataIndex' | 'title' | 'search'>,
) => ProTabulatorColumns<DataType, Params>;

export type ProTabulatorProps<DataType extends IObject, Params extends Record<string, any> = Record<string, any>> = {
    tabulatorID: string;
    request: (
        axiosParams: AxiosParamsType<Params>,
    ) =>
        | Promise<{ data: DataType[]; total: number; success: boolean }>
        | { data: DataType[]; total: number; success: boolean };
    persistenceType?: 'localStorage' | 'sessionStorage';
    numbered?: boolean;
    columns:
        | ((getCol: ProColumnCreatorFunc<DataType, Params>) => ProTabulatorColumns<DataType, Params>[])
        | ProTabulatorColumns<DataType, Params>[];
    defaultPageSize?: number;
    rowKey?: string;
    actionRef?: React.MutableRefObject<ActionType | undefined>;
    primaryColor?: string;
    onRowClick?: (row: DataType) => void;
    rowClassName?: (row: DataType) => string;
    params?: Params;
    hideToolbar?: boolean;
};

export type OptionType<ValueType = string> = {
    label: string;
    value: ValueType;
    disabled?: boolean;
};

export type DateRangeSearch = {
    type: 'dateRange';
    beforeName?: ((name: string) => string) | string;
    afterName?: ((name: string) => string) | string;
    /* default: false */
    updateOnChange?: boolean;
};

export type SelectSearch = {
    type: 'select';
    valueEnum?: Record<string, string>;
    options?: OptionType[];
    request?: () => Promise<OptionType[]>;
    renderOption?: boolean;
    multiple?: boolean;
    persistenceKey?: string;
    /* default: false */
    updateOnChange?: boolean;
};

export type TextSearch = {
    type: 'text';
    /* default: false */
    updateOnChange?: boolean;
};

export type ProTabulatorColumns<
    DataType extends IObject,
    Params extends IObject = IObject,
    Key extends keyof DataType | keyof Params = keyof DataType | keyof Params,
> = {
    dataIndex: Key;
    title: string;
    search: false | DateRangeSearch | SelectSearch | TextSearch;
    width?: number | string;
    fixed?: 'left' | 'right';
    renderText?: (value: Key extends keyof DataType ? DataType[Key] : unknown, record: DataType) => React.ReactNode;
    sorter?: boolean;
};
