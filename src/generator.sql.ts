import { SqlGeneratorProp } from './generator.interface';
import { isEmpty, convertEqual, andCombine, orCombine, commaCombine, sqlEscape, isString } from './utils';
type SqlType = 'select' | 'insert' | 'update' | 'delete';

export class SqlGenerator {
    private sqlMap: SqlGeneratorProp = {
        sqlStr: '',
        and: [],
        or: [],
        field: [],
    };
    constructor(sqlType: SqlType) {
        this.sqlMap.sqlType = sqlType;
    }

    set(data = {}): SqlGenerator {
        this.sqlMap.set = data;
        return this;
    }

    into(data: Record<string, unknown> | Record<string, unknown>[]): SqlGenerator {
        this.sqlMap.into = data;
        return this;
    }

    field(...fields: string[] | Record<string, unknown>[]): SqlGenerator {
        this.sqlMap.field = [...fields];
        return this;
    }

    from(...tables: string[]): SqlGenerator {
        this.sqlMap.from = [...tables];
        return this;
    }

    where(condition = {}): SqlGenerator {
        this.sqlMap.where = condition;
        return this;
    }

    and(andCondition = {}): SqlGenerator {
        this.sqlMap.and.push(andCondition);
        return this;
    }

    or(orCondition = {}): SqlGenerator {
        this.sqlMap.or.push(orCondition);
        return this;
    }

    limit(...limit: number[]): SqlGenerator {
        this.sqlMap.limit = [...limit];
        return this;
    }

    group(...groupField: string[]): SqlGenerator {
        this.sqlMap.groupBy = [...groupField];
        return this;
    }

    order(order: string): SqlGenerator {
        this.sqlMap.order = order;
        return this;
    }

    build(): string {
        switch (this.sqlMap.sqlType) {
            case 'select':
                this.sqlMap.sqlStr = 'SELECT *';
                break;
            case 'insert':
                this.sqlMap.sqlStr = 'INSERT';
                break;
            case 'update':
                this.sqlMap.sqlStr = 'UPDATE';
                break;
            case 'delete':
                this.sqlMap.sqlStr = 'DELETE';
                break;
            default:
                break;
        }
        this.doField();
        this.doSet();
        this.doInto();
        this.doFrom();
        this.doWhere();
        this.doOr();
        this.doAnd();
        this.doGroupBy();
        this.doOrder();
        this.doLimit();
        return this.sqlMap.sqlStr;
    }

    private doInto(): void {
        const table = this.sqlMap.from;
        if (!this.sqlMap.into) {
            return;
        }
        if (Array.isArray(this.sqlMap.into)) {
            let valuesKey = '';
            const intoValues = this.sqlMap.into.map((item, index) => {
                if (index === 0) {
                    valuesKey = commaCombine(Object.keys(item));
                }
                const values = Object.keys(item).map((key) => sqlEscape(item[key]));
                return `( ${commaCombine(values)} )`;
            });
            this.sqlMap.sqlStr = `${this.sqlMap.sqlStr} INTO ${table} ( ${valuesKey} ) VALUES ${commaCombine(
                intoValues,
            )}`;
        } else {
            if (Object(this.sqlMap.into)) {
                const valueKeys = commaCombine(Object.keys(this.sqlMap.into));
                const values = Object.keys(this.sqlMap.into).map((key) => sqlEscape(this.sqlMap.into[key]));
                this.sqlMap.sqlStr = `${this.sqlMap.sqlStr} INTO ${table} ( ${valueKeys} ) VALUES (${commaCombine(
                    values,
                )})`;
            }
        }
    }

    private doSet(): void {
        if (this.sqlMap.set) {
            const setConditions = convertEqual(this.sqlMap.set);
            const setConditionStr = commaCombine(setConditions);
            const table = this.sqlMap.from;
            this.sqlMap.sqlStr = `${this.sqlMap.sqlStr} ${table} SET ${setConditionStr}`;
        }
    }

    private doField(): void {
        if (this.sqlMap.field && this.sqlMap.field.length > 0) {
            const firstArguments = this.sqlMap.field[0];
            let fieldStr = '';
            if (isString(firstArguments)) {
                fieldStr = commaCombine(this.sqlMap.field);
            } else {
                const fieldMaps = Object.keys(firstArguments).map((key) => `${key} AS ${firstArguments[key]}`);
                fieldStr = commaCombine(fieldMaps);
            }

            this.sqlMap.sqlStr = this.sqlMap.sqlStr.replace(/\*/g, fieldStr);
        }
    }

    private doFrom(): void {
        if (this.sqlMap.from && this.sqlMap.from.length > 0) {
            if (this.sqlMap.sqlType === 'select' || this.sqlMap.sqlType === 'delete') {
                const tableStr = commaCombine(this.sqlMap.from);
                this.sqlMap.sqlStr = `${this.sqlMap.sqlStr} FROM ${tableStr}`;
            }
        }
    }

    private doWhere(): void {
        if (!isEmpty(this.sqlMap.where)) {
            const whereConditions: string[] = convertEqual(this.sqlMap.where, this.sqlMap.from);
            const whereStr =
                this.sqlMap.where?._type === 'or' ? orCombine(whereConditions) : andCombine(whereConditions);
            if (whereConditions.length > 1) {
                this.sqlMap.sqlStr = `${this.sqlMap.sqlStr} WHERE ( ${whereStr} )`;
            } else {
                this.sqlMap.sqlStr = `${this.sqlMap.sqlStr} WHERE ${whereStr}`;
            }
        }
    }

    private doOr(): void {
        if (this.sqlMap.or && this.sqlMap.or?.length > 0) {
            const orConditions = this.sqlMap.or.map((object) => {
                return object._type === 'or'
                    ? `( ${orCombine(convertEqual(object))} )`
                    : `( ${andCombine(convertEqual(object))} )`;
            });
            const orConditionStr = orCombine(orConditions);
            this.sqlMap.sqlStr = `${this.sqlMap.sqlStr} OR ${orConditionStr}`;
        }
    }

    private doAnd(): void {
        if (this.sqlMap.and && this.sqlMap.and?.length > 0) {
            const andConditions = this.sqlMap.and.map((object) => {
                return object._type === 'or'
                    ? `( ${orCombine(convertEqual(object, this.sqlMap.from))} )`
                    : `( ${andCombine(convertEqual(object, this.sqlMap.from))} )`;
            });
            const andConditionStr = andCombine(andConditions);
            this.sqlMap.sqlStr = `${this.sqlMap.sqlStr} AND ${andConditionStr}`;
        }
    }

    private doLimit(): void {
        if (this.sqlMap.limit && this.sqlMap.limit.length > 0) {
            const limitStr = commaCombine(this.sqlMap.limit);
            this.sqlMap.sqlStr = this.sqlMap.sqlStr + ` LIMIT ${limitStr}`;
        }
    }

    private doGroupBy(): void {
        if (this.sqlMap.groupBy && this.sqlMap.groupBy.length > 0) {
            const groupByStr = commaCombine(this.sqlMap.groupBy);
            this.sqlMap.sqlStr = this.sqlMap.sqlStr + ` GROUP BY ${groupByStr}`;
        }
    }

    private doOrder(): void {
        if (this.sqlMap.order) {
            this.sqlMap.sqlStr = this.sqlMap.sqlStr + ` ORDER BY ${this.sqlMap.order}`;
        }
    }
}
