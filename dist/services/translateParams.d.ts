import { SortOrder } from 'antd/lib/table/interface';
import React from 'react';
import { AxiosParamsType, IObject } from '../types';
declare const translateParams: <Params extends IObject = IObject>(params: Params & {
    pageSize?: number;
    current?: number;
    keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[]>) => AxiosParamsType<Params>;
export default translateParams;
