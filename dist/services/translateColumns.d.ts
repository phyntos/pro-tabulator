import { ProColumns } from '@ant-design/pro-table';
import React from 'react';
import { IObject, ProTabulatorColumns } from '../types';
declare type TranslateColumnsArgs<DataType extends IObject, Params extends IObject = IObject> = {
    columns: ProTabulatorColumns<DataType, Params>[];
    setParams: React.Dispatch<React.SetStateAction<Params>>;
    params: Params;
    persistenceType?: 'localStorage' | 'sessionStorage' | undefined;
    tabulatorID: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
declare const translateColumns: <DataType extends IObject, Params extends IObject = IObject>({ columns, setParams, params, persistenceType, tabulatorID, setLoading, }: TranslateColumnsArgs<DataType, Params>) => Promise<ProColumns<DataType, "text">[]>;
export default translateColumns;
