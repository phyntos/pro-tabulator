import useLocale from './useLocale';

const useAlertMessage = () => {
    const getLocale = useLocale();

    return (value: number) => {
        const stringValue = value.toString();
        const lastCharIndex = stringValue.length - 1;
        if (lastCharIndex >= 1) {
            if (stringValue[lastCharIndex - 1] === '1') {
                return getLocale('localeSelectedMore') + stringValue + getLocale('localeItemMany');
            }
        }
        if (stringValue[lastCharIndex] === '1')
            return getLocale('localeSelectedOne') + stringValue + getLocale('localeItemOne');
        if (['2', '3', '4'].includes(stringValue[lastCharIndex]))
            return getLocale('localeSelectedMore') + stringValue + getLocale('localeItemMore');

        return getLocale('localeSelectedMore') + stringValue + getLocale('localeItemMany');
    };
};

export default useAlertMessage;
