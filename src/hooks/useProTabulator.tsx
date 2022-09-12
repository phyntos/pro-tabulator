import React from 'react';
import ProTabulator from '../components/ProTabulator';
import { IObject, ProActionType, ProTabulatorProps } from '../types';

const useProTabulator = <DataType extends IObject, Params extends IObject = IObject>(
    props: ProTabulatorProps<DataType, Params>,
) => {
    const actionRef = React.useRef<ProActionType>();

    return {
        tabulator: <ProTabulator<DataType, Params> {...props} />,
        reload: actionRef.current?.reload,
    };
};

export default useProTabulator;
