const getElementSize = (selector: string) => {
    const height = document.querySelector<HTMLElement>(selector)?.offsetHeight || 0;
    const width = document.querySelector<HTMLElement>(selector)?.offsetWidth || 0;
    return { height, width };
};

export default getElementSize;
