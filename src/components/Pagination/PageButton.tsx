import clsx from 'clsx';
import React, { useContext } from 'react';
import ColorContext from '../../contexts/ColorContext';

type PageButtonProps = {
    active?: boolean;
    onClick?: () => void;
    icon?: boolean;
    disabled?: boolean;
    className?: string;
};

const PageButton: React.FC<PageButtonProps> = ({ children, active, onClick, icon, disabled, className }) => {
    const color = useContext(ColorContext);
    return (
        <div
            onClick={disabled ? undefined : onClick}
            className={clsx(
                className,
                'flex',
                'items-center',
                'justify-center',
                'border',
                active && [
                    color === 'indigo' && 'border-indigo-400 bg-indigo-50 text-indigo-600',
                    color === 'blue' && 'border-blue-400 bg-blue-50 text-blue-600',
                    'z-10',
                ],
                !active && 'border-transparent bg-white',
                !(active || disabled) && [
                    color === 'indigo' && 'hover:text-indigo-400',
                    color === 'blue' && 'hover:text-blue-400',
                    'text-gray-500 cursor-pointer',
                ],
                disabled && 'text-gray-200 cursor-not-allowed',
                !icon && 'px-2',
                'h-6',
                'min-w-6',
                'text-sm',
                'font-medium',
                'rounded-sm',
                'select-none',
            )}
        >
            <div>{children}</div>
        </div>
    );
};

export default PageButton;
