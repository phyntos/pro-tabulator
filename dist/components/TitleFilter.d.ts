import React from 'react';
import { DateRangeSearch, IObject, SelectSearch, TextSearch } from '../types';
export declare type FilterProps = {
    name: string;
    title: string;
    error?: boolean;
    onChange: (obj: IObject) => void;
    getValue: (key: string) => string;
    getPrefixCls: (suffixCls?: string | undefined, customizePrefixCls?: string | undefined) => string;
};
export declare type TitleFilterProps<Params> = {
    title: string;
    name: string;
    setParams: React.Dispatch<React.SetStateAction<Params>>;
    params: Params;
    error?: boolean;
} & (DateRangeSearch | SelectSearch | TextSearch);
declare const TitleFilter: <Params extends IObject>({ title, setParams, type, params, ...search }: TitleFilterProps<Params>) => JSX.Element;
export default TitleFilter;
