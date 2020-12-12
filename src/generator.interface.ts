type SqlType = 'select' | 'insert' | 'update' | 'delete';

export interface SqlGeneratorProp {
    field: any[];
    sqlStr: string;
    from?: string[];
    where?: any;
    or: any[];
    and: any[];
    limit?: number[];
    groupBy?: any[];
    order?: string;
    set?: any;
    sqlType?: SqlType;
    into?: any | any[];
}
