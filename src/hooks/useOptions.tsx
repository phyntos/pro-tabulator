import { ProTableProps } from '@ant-design/pro-table';
import React, { useState } from 'react';
import Options from '../components/Options';

const useOptions = (hideToolbar: boolean): ProTableProps<any, any>['toolbar'] => {
    const [className, setClassName] = useState<string>();

    const classList = [];
    if (hideToolbar) {
        classList.push('tabulator-hide-toolbar');
    }
    if (className) {
        classList.push(className);
    }

    return {
        className: classList.join(' '),
        title: hideToolbar ? <Options key='options' className={className} setClassName={setClassName} /> : undefined,
    };
};

export default useOptions;
