import { SqlGenerator } from '../src/generator.sql';

describe('insert sql', () => {
    it('insert table', () => {
        const sql = new SqlGenerator('insert')
            .into({
                username: 1,
                password: 'username',
            })
            .from('table')
            .build();
        expect(sql).toBe("INSERT INTO table ( username, password ) VALUES ( 1, 'username' )");
    });

    it('insert table with keyword', () => {
        const sql = new SqlGenerator('insert')
            .into({
                create_at: 'CURRENT_DATE',
                update_at: 'CURRENT_TIME',
            })
            .from('table')
            .build();
        expect(sql).toBe('INSERT INTO table ( create_at, update_at ) VALUES ( CURRENT_DATE, CURRENT_TIME )');
    });
    interface TestObj {
        username: number | string;
        password: string;
    }
    it('insert table batch', () => {
        const sql = new SqlGenerator('insert')
            .into<TestObj[]>([
                {
                    username: 1,
                    password: 'password',
                },
                {
                    username: 'user_name',
                    password: 'CURRENT_TIME',
                },
            ])
            .from('table')
            .build();
        expect(sql).toBe(
            "INSERT INTO table ( username, password ) VALUES ( 1, 'password' ), ( 'user_name', CURRENT_TIME )",
        );
    });
});
