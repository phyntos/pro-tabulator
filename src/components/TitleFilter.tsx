import { ConfigProvider, Space } from 'antd';
import React, { useContext, useEffect } from 'react';
import { AxiosParamsType, DateRangeSearch, IObject, SelectSearch, TextSearch } from '../types';
import DateRangeFilter from './DateRangeFilter';
import SelectField from './SelectField';
import TextFilter from './TextFilter';

export type FilterProps = {
    name: string;
    title: string;
    error?: boolean;
    onChange: (obj: IObject) => void;
    getValue: (key: string) => string;
    getPrefixCls: (suffixCls?: string | undefined, customizePrefixCls?: string | undefined) => string;
    initialValue?: string;
};

export type TitleFilterProps<Params> = {
    title: string;
    name: string;
    setParams: React.Dispatch<React.SetStateAction<Params>>;
    params: Omit<AxiosParamsType<Params>, 'current' | 'pageSize' | 'orderBy'>;
    error?: boolean;
} & (DateRangeSearch | SelectSearch | TextSearch);

const TitleFilter = <Params extends IObject>({
    title,
    setParams,
    type,
    params,
    ...search
}: TitleFilterProps<Params>) => {
    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

    const onChange = (obj: IObject) => {
        setParams((params) => ({ ...params, ...obj }));
    };

    useEffect(() => {
        console.log({ params });
    }, [params]);

    const getValue = (key: string) => {
        return params[key] as string;
    };

    const extraProps = {
        title,
        onChange,
        getValue,
        getPrefixCls,
    };

    return (
        <Space direction='vertical' className={getPrefixCls('filter-space')}>
            <div className={getPrefixCls('filter-title')}>{title}</div>
            <div
                className={getPrefixCls('filter-field')}
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                {type === 'text' && <TextFilter {...search} {...extraProps} />}
                {type === 'dateRange' && <DateRangeFilter {...search} {...extraProps} />}
                {type === 'select' && <SelectField {...search} {...extraProps} />}
            </div>
        </Space>
    );
};

export default TitleFilter;
