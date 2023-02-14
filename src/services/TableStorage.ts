import { ProTabulatorRequestParams } from '../types';

export default class TableStorage<Params extends Record<string, any> = Record<string, any>> {
    id = '';
    params: ProTabulatorRequestParams<Params> = {
        pageSize: 10,
        current: 1,
    } as ProTabulatorRequestParams<Params>;
    total: number | undefined;

    constructor(id: string | undefined | false) {
        if (id) {
            this.id = id;
            const storageName = `${id}_AxiosParams`;
            const stringifiedParams = sessionStorage.getItem(storageName);
            if (stringifiedParams) {
                this.params = JSON.parse(stringifiedParams);
            }
        }
    }

    setTotal(total: number) {
        this.total = total;
    }

    setParams(params: ProTabulatorRequestParams<Params>) {
        if (this.id) {
            this.params = params;
            sessionStorage.setItem(`${this.id}_AxiosParams`, JSON.stringify(this.params));
        }
    }

    getFormValues() {
        if (this.id) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return (({ pageSize, current, orderBy, ...values }) => values)(this.params);
        }
        return {};
    }

    getPageInfo() {
        return {
            pageSize: this.params.pageSize,
            current: this.params.current,
        };
    }
}
