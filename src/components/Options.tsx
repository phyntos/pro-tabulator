import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import React, { useContext } from 'react';

const Options: React.FC<{
    className?: string;
    setClassName: React.Dispatch<React.SetStateAction<string>>;
}> = ({ className, setClassName }) => {
    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    return (
        <div
            className={getPrefixCls('options-absolute')}
            onClick={() => {
                if (className) {
                    setClassName(undefined);
                } else {
                    setClassName(getPrefixCls('toolbar-show'));
                }
            }}
        >
            {className ? <DownOutlined /> : <UpOutlined />}
        </div>
    );
};

export default Options;
