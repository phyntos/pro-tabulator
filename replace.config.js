/* eslint-disable no-undef */
module.exports = {
    files: './src/styles/table.css',
    from: [/ant-/g, /#1890ff/g, /#40a9ff/g, /#096dd9/g, /#e6f7ff/g],
    to: [
        'tabulator-',
        'var(--tabulator-primary-color)',
        'var(--tabulator-primary-color-hover)',
        'var(--tabulator-primary-color-active)',
        'var(--tabulator-primary-1)',
    ],
};
