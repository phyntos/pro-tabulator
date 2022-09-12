import React from 'react';
export interface IObject {
    [key: string]: unknown;
}
export declare type AxiosParamsType<Params> = Params & {
    pageSize?: number;
    current?: number;
    keyword?: string;
    orderBy?: string;
};
export declare type ProActionType = {
    reload: (resetPageIndex?: boolean) => Promise<void>;
};
declare type ProColumnCreatorFunc<DataType extends IObject, Params extends IObject = IObject> = (dataIndex: ProTabulatorColumns<DataType, Params>['dataIndex'], title: ProTabulatorColumns<DataType, Params>['title'], search: ProTabulatorColumns<DataType, Params>['search'], options?: Omit<ProTabulatorColumns<DataType, Params>, 'dataIndex' | 'title' | 'search'>) => ProTabulatorColumns<DataType, Params>;
export declare type ProTabulatorProps<DataType extends IObject, Params extends IObject = IObject> = {
    tabulatorID: string;
    request: (axiosParams: AxiosParamsType<Params>) => Promise<{
        data: DataType[];
        total: number;
        success: boolean;
    }> | {
        data: DataType[];
        total: number;
        success: boolean;
    };
    persistenceType?: 'localStorage' | 'sessionStorage';
    numbered?: boolean;
    columns: ((getCol: ProColumnCreatorFunc<DataType, Params>) => ProTabulatorColumns<DataType, Params>[]) | ProTabulatorColumns<DataType, Params>[];
    defaultPageSize?: number;
    rowKey?: string;
    actionRef?: React.MutableRefObject<ProActionType | undefined>;
    primaryColor?: string;
    onRowClick?: (row: DataType) => void;
    rowClassName?: (row: DataType) => string;
};
export declare type OptionType = {
    label: string;
    value: string;
    disabled?: boolean;
};
export declare type DateRangeSearch = {
    type: 'dateRange';
    beforeName?: ((name: string) => string) | string;
    afterName?: ((name: string) => string) | string;
    updateOnChange?: boolean;
};
export declare type SelectSearch = {
    type: 'select';
    valueEnum?: Record<string, string>;
    options?: OptionType[];
    request?: () => Promise<OptionType[]>;
    renderOption?: boolean;
    multiple?: boolean;
};
export declare type TextSearch = {
    type: 'text';
    updateOnChange?: boolean;
};
export declare type ProTabulatorColumns<DataType extends IObject, Params extends IObject = IObject, Key extends keyof DataType | keyof Params = keyof DataType | keyof Params> = {
    dataIndex: Key;
    title: string;
    search: false | DateRangeSearch | SelectSearch | TextSearch;
    width?: number | string;
    fixed?: 'left' | 'right';
    renderText?: (value: Key extends keyof DataType ? DataType[Key] : unknown, record: DataType) => React.ReactNode;
    sorter?: boolean;
};
export {};
