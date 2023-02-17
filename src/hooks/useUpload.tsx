import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Dropdown, Spin, Tooltip, Upload } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { RcFile } from 'antd/es/upload';
import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import { ProTabulatorProps } from '../types';

const useUpload = <DataSource extends Record<string, any>, Params extends Record<string, any> = Record<string, any>>({
    uploadProps,
    columns,
    actionRef,
}: Pick<ProTabulatorProps<DataSource, Params>, 'uploadProps' | 'columns' | 'actionRef'>) => {
    const [loading, setLoading] = useState(false);

    const uploadColumns =
        uploadProps?.columns ||
        columns.filter((x) => x.useForUpload).map((x) => ({ dataIndex: String(x.dataIndex), title: x.title }));

    if (!uploadProps?.onUpload) return { uploadRender: [] };

    const fileChange = async (file: RcFile) => {
        try {
            setLoading(true);
            const buffer = await file?.arrayBuffer();
            const wb = read(buffer, { type: 'array' });
            const name = wb.SheetNames[0];
            const ws = wb.Sheets[name];

            const dataJson = utils.sheet_to_json<DataSource>(ws, {
                header: uploadColumns.map((col) => col.dataIndex),
            });
            dataJson.shift();
            await uploadProps.onUpload(dataJson);
            actionRef.current.reload();
        } finally {
            setLoading(false);
        }
        return false;
    };

    const uploadDropdown = (
        <>
            <Dropdown
                key='upload'
                menu={{
                    items: [
                        {
                            label: <span>Скачать шаблон</span>,
                            key: 'downloadTemplate',
                            onClick: () => {
                                new Excel().addSheet('Лист').addColumns(uploadColumns).saveAs('Шаблон.xlsx');
                            },
                        },
                        {
                            label: (
                                <Upload accept='.xlsx' showUploadList={false} beforeUpload={fileChange}>
                                    Загрузить шаблон
                                </Upload>
                            ),
                            key: 'uploadTemplate',
                        },
                    ],
                }}
                trigger={['click']}
            >
                <Tooltip title='Загрузить'>
                    <div className='pro-tabulator-pro-table-list-toolbar-setting-item'>
                        <span>
                            {loading ? (
                                <Spin spinning indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
                            ) : (
                                <UploadOutlined className='icon-button' />
                            )}
                        </span>
                    </div>
                </Tooltip>
            </Dropdown>
        </>
    );

    return { uploadRender: [uploadDropdown] };
};

export default useUpload;
