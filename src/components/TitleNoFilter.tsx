import { ConfigProvider } from 'antd';
import React, { useContext } from 'react';

const TitleNoFilter: React.FC<{ title: string }> = ({ title }) => {
    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    return <div className={`${getPrefixCls('filter-title')} ${getPrefixCls('filter-title-no-filter')}`}>{title}</div>;
};

export default TitleNoFilter;
