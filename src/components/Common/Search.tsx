import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

type SearchProps = {
    index: number;
    value: string;
    onChange: (value: string) => void;
};

const Search = ({ onChange, value, index }: SearchProps) => {
    const [stateValue, setStateValue] = useState('');
    const ref = useRef<HTMLInputElement>();
    const divRef = useRef<HTMLDivElement>();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setStateValue(value || '');
    }, [value]);

    useEffect(() => {
        if (open) ref.current.focus();
    }, [open]);

    useEffect(() => {
        document.body.addEventListener('click', close);

        return function cleanup() {
            window.removeEventListener('click', close);
        };
    }, []);

    const close = () => {
        setOpen(false);
    };

    const changeValue = () => {
        const isEmpty = !stateValue && !value;
        const isEqual = stateValue === value;
        if (!(isEmpty || isEqual)) {
            onChange(stateValue);
        }
        setOpen(false);
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            {value ? (
                <div
                    className='flex items-center hover:bg-gray-100 px-1 gap-1 cursor-pointer'
                    onClick={() => {
                        setOpen((prevOpen) => !prevOpen);
                    }}
                >
                    <div className='font-normal text-gray-400 max-w-[80px] text-ellipsis overflow-hidden'>{value}</div>
                    <XMarkIcon
                        onClick={(event) => {
                            event.stopPropagation();
                            onChange(undefined);
                            setOpen(false);
                        }}
                        className='w-3 text-gray-300 hover:text-gray-400 cursor-pointer'
                    />
                </div>
            ) : (
                <MagnifyingGlassIcon
                    onClick={() => {
                        setOpen((prevOpen) => !prevOpen);
                    }}
                    className='w-4 text-gray-300 hover:text-gray-400 cursor-pointer'
                />
            )}
            <div
                ref={divRef}
                className={clsx(
                    'flex items-center justify-between bg-white top-8 absolute w-44 max-w-max p-1 shadow-md z-10',
                    index === 0 ? 'left-1' : 'right-1',
                    open ? 'block' : 'hidden',
                )}
            >
                <input
                    ref={ref}
                    value={stateValue}
                    onChange={(event) => setStateValue(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') changeValue();
                    }}
                    type='text'
                    className={clsx('outline-none font-normal')}
                />
                <XMarkIcon
                    onClick={() => {
                        setStateValue('');
                        ref.current.focus();
                    }}
                    className={clsx(
                        'w-3 text-gray-300 hover:text-gray-400 cursor-pointer',
                        stateValue ? 'visible' : 'invisible',
                    )}
                />
                <MagnifyingGlassIcon
                    onClick={changeValue}
                    className='w-4 text-gray-300 hover:text-gray-400 cursor-pointer'
                />
            </div>
        </div>
    );
};

export default Search;
