import { SqlGenerator } from '../src/generator.sql';
describe('query sql', () => {
    it('select * from table', () => {
        const sql = new SqlGenerator('select').from('table').build();
        expect(sql).toBe('SELECT * FROM table');
    });

    it('select fields from table', () => {
        const sql = new SqlGenerator('select').field('user_name', 'password').from('table').build();
        expect(sql).toBe('SELECT user_name, password FROM table');
    });

    it('select fieldsMap from table', () => {
        const sql = new SqlGenerator('select')
            .field({
                user_name: 'userName',
                user_age: 'userAge',
            })
            .from('table')
            .build();
        expect(sql).toBe('SELECT user_name AS userName, user_age AS userAge FROM table');
    });
    it('select table.field from table', () => {
        const sql = new SqlGenerator('select').field('table.user_name', 'table.password').from('table').build();
        expect(sql).toBe('SELECT table.user_name, table.password FROM table');
    });

    it('select fields from table where', () => {
        const sql = new SqlGenerator('select')
            .field('user_name', 'nick_name')
            .where({
                password: 22,
            })
            .from('table')
            .build();
        expect(sql).toBe('SELECT user_name, nick_name FROM table WHERE password = 22');
    });

    it('select fields from table1,table2 where', () => {
        const sql = new SqlGenerator('select')
            .field('user_name', 'nick_name')
            .where({
                'table.user_name': 'table1.user_test_name',
                'table1.password': 22,
            })
            .from('table', 'table1')
            .build();
        expect(sql).toBe(
            'SELECT user_name, nick_name FROM table, table1 WHERE ( table.user_name = table1.user_test_name AND table1.password = 22 )',
        );
    });

    it('select fields from table1,table2 where and or', () => {
        const sql = new SqlGenerator('select')
            .field('user_name', 'nick_name')
            .where({
                'table.user_name': 'user_test_name',
                userName: 'ssss',
            })
            .from('table')
            .or({
                user_name: 'user1',
            })
            .build();
        expect(sql).toBe(
            "SELECT user_name, nick_name FROM table WHERE ( table.user_name = 'user_test_name' AND userName = 'ssss' ) OR ( user_name = 'user1' )",
        );
    });

    it('select fields from table1,table2 where double and or', () => {
        const sql = new SqlGenerator('select')
            .field('user_name', 'nick_name')
            .where({
                'table.user_name': 'user_test_name',
                userName: 'ssss',
            })
            .from('table')
            .or({
                userOr: 23,
            })
            .and({
                user_name: 'user1',
            })
            .build();
        expect(sql).toBe(
            "SELECT user_name, nick_name FROM table WHERE ( table.user_name = 'user_test_name' AND userName = 'ssss' ) OR ( userOr = 23 ) AND ( user_name = 'user1' )",
        );
    });

    it('select fields from table1,table2 where double or or', () => {
        const sql = new SqlGenerator('select')
            .field('user_name', 'nick_name')
            .where({
                'table.user_name': 'user_test_name',
                userName: 'ssss',
            })
            .from('table')
            .or({
                userOr: 23,
                passOr: 'passOr',
            })
            .or({
                user_name: 'user1',
                user_demo: 'ccc',
            })
            .build();
        expect(sql).toBe(
            "SELECT user_name, nick_name FROM table WHERE ( table.user_name = 'user_test_name' AND userName = 'ssss' ) OR ( userOr = 23 AND passOr = 'passOr' ) OR ( user_name = 'user1' AND user_demo = 'ccc' )",
        );
    });

    it('select fields from table1,table2 where double and and', () => {
        const sql = new SqlGenerator('select')
            .field('user_name', 'nick_name')
            .where({
                'table.user_name': 'user_test_name',
                userName: 'ssss',
            })
            .from('table')
            .and({
                userOr: 23,
                passOr: 'passOr',
            })
            .and({
                user_name: 'user1',
                user_demo: 'ccc',
            })
            .build();
        expect(sql).toBe(
            "SELECT user_name, nick_name FROM table WHERE ( table.user_name = 'user_test_name' AND userName = 'ssss' ) AND ( userOr = 23 AND passOr = 'passOr' ) AND ( user_name = 'user1' AND user_demo = 'ccc' )",
        );
    });

    it('select fields from table1,table2 where gather than', () => {
        const sql = new SqlGenerator('select')
            .field('user_name', 'nick_name')
            .where({
                'table.user_name': ['>', 'user_test_name'],
                userName: ['<=', 'ssss'],
            })
            .from('table')
            .and({
                userOr: 23,
                passOr: 'passOr',
            })
            .and({
                user_name: 'user1',
                user_demo: 'ccc',
            })
            .build();
        expect(sql).toBe(
            "SELECT user_name, nick_name FROM table WHERE ( table.user_name > 'user_test_name' AND userName <= 'ssss' ) AND ( userOr = 23 AND passOr = 'passOr' ) AND ( user_name = 'user1' AND user_demo = 'ccc' )",
        );
    });

    it('select fields from table1,table2 where like condition', () => {
        const sql = new SqlGenerator('select')
            .field('user_name', 'nick_name')
            .where({
                user_name: ['like', `%user_test_name%`],
            })
            .from('table')
            .build();
        expect(sql).toBe("SELECT user_name, nick_name FROM table WHERE user_name LIKE '%user_test_name%'");
    });

    it('select fields from table1,table2 where inset or condition', () => {
        const sql = new SqlGenerator('select')
            .field('user_name', 'nick_name')
            .where({
                user_name: ['>', 'user_test_name'],
                userName: ['<=', 'ssss'],
                _type: 'or',
            })
            .from('table')
            .or({
                userOr: 23,
                passOr: 'passOr',
                _type: 'or',
            })
            .build();
        expect(sql).toBe(
            "SELECT user_name, nick_name FROM table WHERE ( user_name > 'user_test_name' OR userName <= 'ssss' ) OR ( userOr = 23 OR passOr = 'passOr' )",
        );
    });

    it('select fields from table1,table2 where inset or limit', () => {
        const sql = new SqlGenerator('select')
            .field('user_name', 'nick_name')
            .where({
                user_name: ['>', 'user_test_name'],
                userName: ['<=', 'ssss'],
                _type: 'or',
            })
            .from('table')
            .or({
                userOr: 23,
                passOr: 'passOr',
                _type: 'or',
            })
            .limit(2, 4)
            .build();
        expect(sql).toBe(
            "SELECT user_name, nick_name FROM table WHERE ( user_name > 'user_test_name' OR userName <= 'ssss' ) OR ( userOr = 23 OR passOr = 'passOr' ) LIMIT 2, 4",
        );
    });

    it('select fields from table1,table2 where inset or limit', () => {
        const sql = new SqlGenerator('select')
            .field('user_name', 'nick_name')
            .where({
                user_name: ['>', 'user_test_name'],
            })
            .from('table')
            .limit(2, 4)
            .build();
        expect(sql).toBe("SELECT user_name, nick_name FROM table WHERE user_name > 'user_test_name' LIMIT 2, 4");
    });

    it('select fields from table1,table2 where inset groupBy', () => {
        const sql = new SqlGenerator('select')
            .field('user_name', 'nick_name')
            .where({
                user_name: ['>', 'user_test_name'],
            })
            .group('username', 'password')
            .from('table')
            .limit(2, 4)
            .build();
        expect(sql).toBe(
            "SELECT user_name, nick_name FROM table WHERE user_name > 'user_test_name' GROUP BY username, password LIMIT 2, 4",
        );
    });

    it('select fields from table1,table2 where inset groupBy orderby', () => {
        const sql = new SqlGenerator('select')
            .field('user_name', 'nick_name')
            .where({
                user_name: ['>', 'user_test_name'],
            })
            .from('table')
            .group('username', 'password')
            .order('id DESC')
            .limit(2, 4)
            .build();
        expect(sql).toBe(
            "SELECT user_name, nick_name FROM table WHERE user_name > 'user_test_name' GROUP BY username, password ORDER BY id DESC LIMIT 2, 4",
        );
    });
});
