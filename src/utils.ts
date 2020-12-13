import SqlString from 'sqlstring';
import { mysqlKeyWord } from './keyWord';
export const isEmpty = (val: any): boolean => val == null || !(Object.keys(val) || val).length;

export const isString = (val: any): boolean => typeof val === 'string';

export const convertEqual = (obj: any = {}, tables?: string[]): string[] => {
    return Object.keys(obj)
        .filter((key) => key !== '_type')
        .map((key) => {
            if (Array.isArray(obj[key])) {
                const expression = obj[key][0] === 'like' ? obj[key][0].toUpperCase() : obj[key][0];
                const val = obj[key][1];
                if (isMysqlKeyWord(val)) {
                    return `${key} ${expression} ${val}`;
                }
                return `${key} ${expression} ${SqlString.escape(val)}`;
            }

            const firstItem = key.split(/\./)[0];
            const valFirstItem = isString(obj[key]) && obj[key].split(/\./)[0];
            return (tables && tables.includes(firstItem) && tables.includes(valFirstItem)) || isMysqlKeyWord(obj[key])
                ? `${key} = ${obj[key]}`
                : `${key} = ${SqlString.escape(obj[key])}`;
        });
};

export const isMysqlKeyWord = (key: string): boolean => {
    return mysqlKeyWord.includes(key);
};

export const andCombine = (opts: string[]): string => {
    return opts.join(' AND ').toString();
};

export const orCombine = (opts: string[]): string => {
    return opts.join(' OR ').toString();
};

export const commaCombine = (opts: string[] | number[]): string => {
    return opts.join(', ').toString();
};

export const sqlEscape = (val: any): any => {
    return SqlString.escape(val);
};

// const toCamelCase = () => {};
