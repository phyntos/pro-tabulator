import { LinkOutlined } from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import ProTabulator from '../ProTabulator';
import { ProTabulatorRequestParams } from '../types';
import ruRU from 'antd/locale/ru_RU';
import kkKZ from 'antd/locale/kk_KZ';

type DevDataType = 'first' | 'second';

type DevData = {
    id: number;
    name?: string;
    date?: string;
    description?: string;
    type?: DevDataType;
};

type DevDataFilter = {
    name?: string;
    dateBefore?: string;
    dateAfter?: string;
    type: DevDataType[];
};

const mockData: DevData[] = [
    {
        id: 1,
        name: 'asd',
        date: '2014-08-01T15:30',
        description: 'Lorem ipsum dolor sit amet, consectetur adip',
        type: 'second',
    },
    { id: 2, name: 'fgh', date: '2014-08-01T15:30', type: 'second' },
    { id: 3, name: 'fgh', date: '2015-08-01T15:30', type: 'first' },
    { id: 4, name: 'fgh', date: '2016-08-01T15:30', type: 'second' },
    { id: 5, name: 'fgh', date: '2014-08-01T15:30', type: 'second' },
    { id: 6, name: 'asd', date: '2017-08-01T15:30', type: 'first' },
    { id: 7, name: 'afg', date: '2017-08-01T15:30', type: 'second' },
    { id: 8, name: 'fgh', date: '2018-08-01T15:30', type: 'first' },
    { id: 9, name: 'fgh', date: '2018-08-01T15:30', type: 'second' },
    { id: 10, name: 'fgh', date: '2014-08-01T15:30', type: 'second' },
    { id: 11, name: 'fgh', date: '2019-08-01T15:30', type: 'first' },
    { id: 12, name: 'fgh', date: '2014-08-01T15:30', type: 'second' },
    { id: 13, name: 'fgh', date: '2045-08-01T15:30', type: 'second' },
];

const typeOptions = [
    { label: 'Первый', value: 'first' },
    { label: 'Второй', value: 'second' },
];

// const getType = (): Promise<ProTabulatorSelectOptionType[]> =>
//     new Promise((resolve, reject) => {
//         const error = false;
//         setTimeout(() => resolve(typeOptions), 1000);
//         if (error) reject();
//     });

const getData = async (
    params: ProTabulatorRequestParams<DevDataFilter>,
): Promise<{ data: DevData[]; total: number; success: boolean }> => {
    let data = mockData;
    if (params.name !== undefined) {
        data = data.filter((item) => (params.name !== undefined ? item.name?.includes(params.name) : true));
    }
    if (params.dateAfter !== undefined) {
        data = data.filter((item) => dayjs(item.date).isBefore(dayjs(params.dateAfter)));
    }
    if (params.dateBefore !== undefined) {
        data = data.filter((item) => dayjs(item.date).isAfter(dayjs(params.dateBefore)));
    }
    if (params.type && params.type.length > 0) {
        data = data.filter((item) => item.type && params.type?.includes(item.type));
    }

    // console.log('request', JSON.parse(JSON.stringify(params)));

    return new Promise((resolve, reject) => {
        const error = false;
        setTimeout(() => resolve({ data, success: true, total: data.length }), 1000);
        if (error) reject();
    });
};

const DevTabulator = () => {
    const [lang] = useState<'kk' | 'ru'>('kk');

    return (
        <ConfigProvider locale={lang === 'ru' ? ruRU : kkKZ}>
            <div
                style={{
                    height: '90vh',
                }}
            >
                <ProTabulator<DevData, DevDataFilter>
                    // dataSource={mockData}
                    request={getData}
                    // hiddenFilter
                    ordered
                    editable
                    downloadProps={{
                        fileName: 'ASD',
                    }}
                    pagination={{
                        defaultPageSize: 10,
                    }}
                    disableStorage
                    id='TEST'
                    uploadProps={{
                        columns: [
                            {
                                dataIndex: 'name',
                                title: 'Наименование',
                            },
                            {
                                dataIndex: 'type',
                                title: 'Тип номер',
                            },
                        ],
                        onUpload: async (data) => {
                            await getData({});
                            console.log(data);
                        },
                    }}
                    columns={[
                        {
                            dataIndex: 'name',
                            title: 'Наименование',
                            valueType: 'text',
                            searchState: 'fixed',
                            width: 200,
                        },
                        {
                            dataIndex: 'type',
                            title: 'Тип номер',
                            valueType: 'select',
                            // filterMode: 'hidden',
                            // request: getType,
                            fieldProps: (form, schema) => ({
                                mode: schema.isEditable ? undefined : 'multiple',
                                showSearch: schema.isEditable,
                                onChange: (value: string) => {
                                    if (schema.rowKey) form.setFieldValue([schema.rowKey, 'name'], value);
                                },
                            }),
                            width: 500,
                            render: (dom, record) => (
                                <>
                                    {dom} - {record.name}
                                </>
                            ),
                            request: async (params) => {
                                return typeOptions.concat({ label: params.keyWords, value: params.keyWords || 'CODE' });
                            },
                        },
                        {
                            dataIndex: 'date',
                            title: 'Дата номер',
                            valueType: 'dateApartRange',
                            searchState: 'hidden',
                        },
                        {
                            dataIndex: 'date',
                            title: 'Дата номер',
                            valueType: 'option',
                            render: () => {
                                return (
                                    <Button size='small' type='link'>
                                        <LinkOutlined />
                                    </Button>
                                );
                            },
                        },
                    ]}
                    editableProps={{
                        onSaveMultiple: async (data) => {
                            console.log('SAVE_MULTIPLE', data);
                        },
                        onSave: async (data) => {
                            console.log('SAVE', data);
                        },
                        onDelete: async (data) => {
                            console.log(data);
                        },
                        onCreate: async () => {
                            mockData.unshift({
                                id: 14,
                            });
                            console.log('CREATE');
                            return 14;
                        },
                        onManualCreate: async (data) => {
                            mockData.unshift({
                                id: 14,
                            });
                            console.log('MANUAL_CREATE', data);
                            return 14;
                        },
                        onDeleteMultiple: async (data) => {
                            console.log(data);
                        },
                        hidden: {
                            actions: {
                                // delete: true,
                            },
                            // saveMultiple: true,
                        },
                    }}
                />
            </div>
        </ConfigProvider>
    );
};

export default DevTabulator;
