import React from 'react';
import { AxiosParamsType, IObject, ProTabulatorProps } from '../types';
declare type TablePaginationHookArgs<DataType extends IObject, Params extends IObject = IObject> = Pick<ProTabulatorProps<DataType, Params>, 'request' | 'numbered'> & {
    setAxiosParams: React.Dispatch<React.SetStateAction<AxiosParamsType<Params>>>;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
};
declare function useRequest<DataType extends IObject, Params extends IObject = IObject>({ request, setAxiosParams, setTotal, numbered, }: TablePaginationHookArgs<DataType, Params>): (params: Params & {
    pageSize?: number;
    current?: number;
    keyword?: string;
}, sort: Record<string, import("antd/lib/table/interface").SortOrder>, filter: Record<string, React.ReactText[]>) => Promise<Partial<import("@ant-design/pro-table").RequestData<DataType>>>;
export default useRequest;
