import { ProTableProps } from '@ant-design/pro-table';
import React, { useState } from 'react';
import Options from '../components/Options';

const useOptions = (hidden: boolean, title: string): ProTableProps<any, any>['toolbar'] => {
    const [className, setClassName] = useState<string>();

    const classList = [];
    if (hidden) {
        classList.push('tabulator-hide-toolbar');
    }
    if (className) {
        classList.push(className);
    }

    return {
        className: classList.join(' '),
        title: hidden ? <Options key='options' className={className} setClassName={setClassName} /> : title,
    };
};

export default useOptions;
