import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

type SearchProps = {
    value: string;
    onChange: (value: string) => void;
};

const Search = ({ onChange, value: defaultValue }: SearchProps) => {
    const [value, setValue] = useState('');
    const ref = useRef<HTMLInputElement>();
    const divRef = useRef<HTMLDivElement>();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setValue(defaultValue || '');
    }, [defaultValue]);

    useEffect(() => {
        if (open) ref.current.focus();
    }, [open]);

    return (
        <div>
            {defaultValue ? (
                <div
                    className='flex items-center hover:bg-gray-100 px-1 gap-1 cursor-pointer'
                    onClick={() => {
                        setOpen((prevOpen) => !prevOpen);
                    }}
                >
                    <div className='font-normal text-gray-400 max-w-[80px] text-ellipsis overflow-hidden'>
                        {defaultValue}
                    </div>
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
                    'flex items-center justify-between bg-white right-1 top-8 absolute w-44 max-w-full p-1 shadow-md',
                    open ? 'block' : 'hidden',
                )}
            >
                <input
                    ref={ref}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            onChange(value);
                            setOpen(false);
                        }
                    }}
                    type='text'
                    className={clsx('outline-none font-normal')}
                />
                {value && (
                    <XMarkIcon
                        onClick={() => {
                            setValue('');
                            ref.current.focus();
                        }}
                        className='w-3 text-gray-300 hover:text-gray-400 cursor-pointer'
                    />
                )}
                <MagnifyingGlassIcon
                    onClick={() => {
                        onChange(value);
                        setOpen(false);
                    }}
                    className='w-4 text-gray-300 hover:text-gray-400 cursor-pointer'
                />
            </div>
        </div>
    );
};

export default Search;
