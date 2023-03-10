const LOCALE_SELECTED_ONE = 'Выбран ';
const LOCALE_SELECTED_MORE = 'Выбрано ';

const LOCALE_ITEM_ONE = ' элемент';
const LOCALE_ITEM_MORE = ' элемента';
const LOCALE_ITEM_MANY = ' элементов';

const getAlertMessage = (value: number) => {
    const stringValue = value.toString();
    const lastCharIndex = stringValue.length - 1;
    if (lastCharIndex >= 1) {
        if (stringValue[lastCharIndex - 1] === '1') {
            return LOCALE_SELECTED_MORE + stringValue + LOCALE_ITEM_MANY;
        }
    }
    if (stringValue[lastCharIndex] === '1') return LOCALE_SELECTED_ONE + stringValue + LOCALE_ITEM_ONE;
    if (['2', '3', '4'].includes(stringValue[lastCharIndex]))
        return LOCALE_SELECTED_MORE + stringValue + LOCALE_ITEM_MORE;

    return LOCALE_SELECTED_MORE + stringValue + LOCALE_ITEM_MANY;
};

export default getAlertMessage;
