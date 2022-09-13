import { SearchOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Input } from 'antd';
import React, { useContext } from 'react';

const FilterSearch: React.FC<{
    onClick: () => void;
    hidden: boolean;
    status?: 'error' | 'warning' | undefined;
}> = ({ onClick, children, hidden, status }) => {
    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    const classList = [getPrefixCls('filter-search-btn')];
    if (status === 'error') {
        classList.push(getPrefixCls('filter-search-btn-error'));
    }
    if (status === 'warning') {
        classList.push(getPrefixCls('filter-search-btn-warning'));
    }

    return (
        <Input.Group compact>
            {children}
            {!hidden && (
                <Button
                    className={classList.join(' ')}
                    icon={<SearchOutlined />}
                    size='small'
                    disabled={status === 'error'}
                    onClick={onClick}
                />
            )}
        </Input.Group>
    );
};

export default FilterSearch;
