import { ActionType } from '@ant-design/pro-table';
import React from 'react';
import ProTabulator from '../ProTabulator';
import { ProTabulatorProps } from '../types';

const useProTabulator = <
    DataType extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
>(
    props: ProTabulatorProps<DataType, Params>,
) => {
    const actionRef = React.useRef<ActionType>();

    return {
        tabulator: <ProTabulator<DataType, Params> {...props} />,
        reload: actionRef.current?.reload,
    };
};

export default useProTabulator;
