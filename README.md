# pro-tabulator

Tabulator based on [@ant-design/pro-table](https://www.npmjs.com/package/@ant-design/pro-table).

## Install

```
npm install pro-tabulator
```

## Usage

```js
<ProTabulator<Data, Params>
    request={getData}
    ordered
    editable
    downloadProps={{
        fileName: 'Data',
    }}
    id='Data'
    uploadProps={{
        columns: [
            {
                dataIndex: 'name',
                title: 'Name',
            },
            {
                dataIndex: 'type',
                title: 'Type',
            },
        ],
        onUpload: async (data) => {
            await uploadData(data);
        },
    }}
    columns={[
        {
            dataIndex: 'name',
            title: 'Name',
            valueType: 'text',
            searchState: 'fixed',
            width: 200,
        },
        {
            dataIndex: 'type',
            title: 'Тип номер',
            valueType: 'select',
            width: 500,
            valueEnum: { first: 'First', second: 'Second' }
        },
        {
            dataIndex: 'date',
            title: 'Date',
            valueType: 'dateApartRange',
            searchState: 'hidden',
        },
        {
            dataIndex: '',
            title: 'Options',
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
            await onSaveMultiple(data);
        },
        onSave: async (data) => {
            await onSave(data);
        },
        onDelete: async (data) => {
            await onDelete(data);
        },
        onCreate: async () => {
            return await onCreate();
        },
        onManualCreate: async (data) => {
            return await onManualCreate(data);
        },
        onDeleteMultiple: async (data) => {
           await onManualCreate();
        },
        hidden: {
            actions: {
                delete: true,
            },
            saveMultiple: true,
        },
    }}
/>
```
