# pro-tabulator

Tabulator based on [@ant-design/pro-table](https://www.npmjs.com/package/@ant-design/pro-table).

## Install

```
npm install pro-tabulator
```

## Usage

```js
<ProTabulator<DataType, ParamsType>
    tabulatorID='tabulatorID'
    request={(params) => {
        return {
            data: [{ id: 1, name: 'Name', date: '2022-09-15T09:37', type: '1' }],
            success: true,
            total: 1,
        };
    }}
    columns={[
        {
            dataIndex: 'name',
            title: 'Name',
            search: { type: 'text' },
        },
        {
            dataIndex: 'date',
            title: 'Date',
            search: { type: 'dateRange' },
        },
        {
            dataIndex: 'type',
            title: 'Type',
            search: {
                type: 'select',
                options: [
                    { label: 'First', value: '1' },
                    { label: 'Second', value: '2' },
                ],
                renderOption: true,
            },
        },
    ]}
    rowKey='id'
/>
```
