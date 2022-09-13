import { ConfigProvider } from 'antd';
import React, { useContext } from 'react';

const TitleNoFilter: React.FC<{ title: string; isSearch: boolean }> = ({ title, isSearch }) => {
    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

    const classList = [getPrefixCls('filter-title')];
    if (isSearch) {
        classList.push(getPrefixCls('filter-title-no-filter'));
    } else {
        classList.push(getPrefixCls('filter-title-no-search'));
    }

    return (
        <div
            onClick={(event) => {
                event.stopPropagation();
            }}
            className={classList.join(' ')}
        >
            {title}
        </div>
    );
};

export default TitleNoFilter;
