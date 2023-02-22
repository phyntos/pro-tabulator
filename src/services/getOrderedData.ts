const getOrderedData = <DataSource>(
    data: DataSource[] | undefined,
    current = 1,
    pageSize = 10,
): (DataSource & { orderNumber: number })[] => {
    return (
        data?.map((item, index) => {
            return {
                ...item,
                orderNumber: (current - 1) * pageSize + index + 1,
            };
        }) || []
    );
};

export default getOrderedData;
