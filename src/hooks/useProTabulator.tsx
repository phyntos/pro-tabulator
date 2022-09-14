import { ActionType } from '@ant-design/pro-table';
import React from 'react';
import ProTabulator from '../ProTabulator';
import { IObject, ProTabulatorProps } from '../types';

const useProTabulator = <DataType extends IObject, Params extends IObject = IObject>(
    props: ProTabulatorProps<DataType, Params>,
) => {
    const actionRef = React.useRef<ActionType>();

    return {
        tabulator: <ProTabulator<DataType, Params> {...props} />,
        reload: actionRef.current?.reload,
    };
};

export default useProTabulator;
