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
        expect(sql).toBe("INSERT INTO table ( username, password ) VALUES (1, 'username')");
    });

    it('insert table batch', () => {
        const sql = new SqlGenerator('insert')
            .into([
                {
                    username: 1,
                    password: 'password',
                },
                {
                    username: 'user_name',
                    password: 'pass_word_user2',
                },
            ])
            .from('table')
            .build();
        expect(sql).toBe(
            "INSERT INTO table ( username, password ) VALUES ( 1, 'password' ), ( 'user_name', 'pass_word_user2' )",
        );
    });
});
