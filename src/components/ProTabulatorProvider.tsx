import { ConfigProvider } from 'antd';
import React from 'react';

const ProTabulatorProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ConfigProvider prefixCls='pro-tabulator' iconPrefixCls='pro-tabulator-icon'>
            {children}
        </ConfigProvider>
    );
};

export default ProTabulatorProvider;
