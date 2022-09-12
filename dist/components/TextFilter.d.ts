import { TextSearch } from '../types';
import { FilterProps } from './TitleFilter';
declare type TextFilterProps = Omit<TextSearch, 'type'> & FilterProps;
declare const TextFilter: ({ name, onChange, getValue, title, updateOnChange, getPrefixCls }: TextFilterProps) => JSX.Element;
export default TextFilter;
