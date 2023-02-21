import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs';
import ruRU from 'antd/locale/ru_RU';
import { ConfigProvider } from 'antd';
import React from 'react';

const ProTabulatorProvider = ({ colorPrimary, children }: { colorPrimary?: string; children: React.ReactNode }) => {
    return (
        <StyleProvider hashPriority='high' transformers={[legacyLogicalPropertiesTransformer]}>
            <ConfigProvider
                locale={ruRU}
                theme={
                    colorPrimary
                        ? {
                              token: {
                                  colorPrimary,
                                  colorInfo: colorPrimary,
                              },
                          }
                        : undefined
                }
                prefixCls='pro-tabulator'
                iconPrefixCls='pro-tabulator-icon'
            >
                {children}
            </ConfigProvider>
        </StyleProvider>
    );
};

export default ProTabulatorProvider;
