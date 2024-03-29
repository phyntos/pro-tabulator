import ru from '../locales/ru';
import kk from '../locales/kk';
import en from '../locales/en';
import { useContext } from 'react';
import { ConfigProvider } from 'antd';

const locales = { ru, kk, en };

const useLocale = () => {
    const { locale } = useContext(ConfigProvider.ConfigContext);

    return (text: keyof typeof locales.ru) => {
        // console.log({ text, locale: locale.locale, locales });

        let lang = locale.locale;
        if (!Object.keys(locales).includes(locale.locale)) {
            lang = 'ru';
        }
        return locales[lang as keyof typeof locales][text];
    };
};

export default useLocale;
