import { Card, Checkbox, Col, ConfigProvider, Form, Input, Row, Switch } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import ProTabulator from '../ProTabulator';
// import ProTabulator from '../ProTabulator';
import { AxiosParamsType, OptionType } from '../types';
import ru_RU from 'antd/lib/locale-provider/ru_RU';
import 'antd/dist/antd.min.css';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

type DevDataType = 'first' | 'second';

type DevData = {
    name: string;
    date: string;
    description?: string;
    type: DevDataType;
};

type DevDataFilter = {
    name?: string;
    dateBefore?: string;
    dateAfter?: string;
    type: DevDataType[];
};

const mockData: DevData[] = [
    {
        name: 'asd',
        date: '2014-08-01T15:30',
        description: 'Lorem ipsum dolor sit amet, consectetur adip',
        type: 'second',
    },
    { name: 'fgh', date: '2014-08-01T15:30', type: 'second' },
    { name: 'fgh', date: '2015-08-01T15:30', type: 'first' },
    { name: 'fgh', date: '2016-08-01T15:30', type: 'second' },
    { name: 'fgh', date: '2014-08-01T15:30', type: 'second' },
    { name: 'asd', date: '2017-08-01T15:30', type: 'first' },
    { name: 'afg', date: '2017-08-01T15:30', type: 'second' },
    { name: 'fgh', date: '2018-08-01T15:30', type: 'first' },
    { name: 'fgh', date: '2018-08-01T15:30', type: 'second' },
    { name: 'fgh', date: '2014-08-01T15:30', type: 'second' },
    { name: 'fgh', date: '2019-08-01T15:30', type: 'first' },
    { name: 'fgh', date: '2014-08-01T15:30', type: 'second' },
    { name: 'fgh', date: '2045-08-01T15:30', type: 'second' },
];

const getType = (): Promise<OptionType<DevDataType>[]> =>
    new Promise((resolve, reject) => {
        const error = true;
        setTimeout(
            () =>
                resolve([
                    { label: 'Первый', value: 'first' },
                    { label: 'Второй', value: 'second' },
                ]),
            1000,
        );
        if (error) reject();
    });

const getData = async (
    params: AxiosParamsType<DevDataFilter>,
): Promise<{ data: DevData[]; total: number; success: boolean }> => {
    let data = mockData;
    if (params.name !== undefined) {
        data = data.filter((item) => (params.name !== undefined ? item.name.includes(params.name) : true));
    }
    if (params.dateAfter !== undefined) {
        data = data.filter((item) => moment(item.date).isBefore(moment(params.dateAfter)));
    }
    if (params.dateBefore !== undefined) {
        data = data.filter((item) => moment(item.date).isAfter(moment(params.dateBefore)));
    }
    if (params.type && params.type.length > 0) {
        data = data.filter((item) => params.type.includes(item.type));
    }

    console.log('request', JSON.parse(JSON.stringify(params)));

    return new Promise((resolve, reject) => {
        const error = false;
        setTimeout(() => resolve({ data, success: true, total: data.length }), 1000);
        if (error) reject();
    });
};

const DevTabulator = () => {
    const [showToolbar, setShowToolbar] = useState(true);
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState<CheckboxValueType[]>(['setting', 'reload']);

    return (
        <ConfigProvider locale={ru_RU}>
            <div style={{ padding: '20px 50px', height: '100vh' }}>
                <Row gutter={16}>
                    <Col span={18}>
                        <ProTabulator<DevData, DevDataFilter>
                            tabulatorID='DEV'
                            numbered
                            persistenceType='sessionStorage'
                            request={getData}
                            primaryColor='green'
                            toolbar={{
                                hidden: !showToolbar,
                                title,
                                options: {
                                    setting: options.some((x) => x === 'setting'),
                                    reload: options.some((x) => x === 'reload'),
                                },
                            }}
                            // params={{
                            //     type: ['first'],
                            // }}
                            columns={(getCol) => [
                                getCol(
                                    'name',
                                    'Наименование',
                                    { type: 'text', updateOnChange: false },
                                    // false,
                                    { width: '200px', sorter: true },
                                ),
                                getCol(
                                    'date',
                                    'Дата',
                                    { type: 'dateRange', updateOnChange: false },
                                    // false,
                                    { width: '500px' },
                                ),
                                getCol(
                                    'description',
                                    'Описание',
                                    { type: 'text' },
                                    // false,
                                    { width: '100px' },
                                ),
                                getCol(
                                    'type',
                                    'Тип',
                                    {
                                        type: 'select',
                                        request: getType,
                                        persistenceKey: 'type',
                                        renderOption: true,
                                        multiple: true,
                                    },
                                    // false,
                                    { width: '200px', sorter: true },
                                ),
                            ]}
                            rowKey='numberedIndex'
                        />
                    </Col>
                    <Col span={6}>
                        <Card style={{ height: '100%', width: '100%' }}>
                            <Form>
                                <Form.Item label='Title'>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                                </Form.Item>
                                <Form.Item valuePropName='checked' label='Toolbar'>
                                    <Switch checked={showToolbar} onChange={setShowToolbar} />
                                </Form.Item>
                                <Form.Item label='Options'>
                                    <Checkbox.Group
                                        options={[
                                            { label: 'Setting', value: 'setting' },
                                            { label: 'Reload', value: 'reload' },
                                        ]}
                                        value={options}
                                        onChange={setOptions}
                                    />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </ConfigProvider>
    );
};

export default DevTabulator;
