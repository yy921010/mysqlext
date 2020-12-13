import { SqlGenerator } from '../src/generator.sql';

describe('update sql', () => {
    it('update table', () => {
        const sql = new SqlGenerator('update')
            .set({
                username: 1,
                password: 'username',
            })
            .from('table')
            .build();
        expect(sql).toBe("UPDATE table SET username = 1, password = 'username'");
    });

    it('update table where', () => {
        const sql = new SqlGenerator('update')
            .set({
                username: 1,
                password: 'username',
            })
            .from('table')
            .where({
                username: 'cc',
            })
            .build();
        expect(sql).toBe("UPDATE table SET username = 1, password = 'username' WHERE username = 'cc'");
    });

    it('delete table', () => {
        const sql = new SqlGenerator('delete')
            .from('table')
            .where({
                username: 'cc',
            })
            .build();
        expect(sql).toBe("DELETE FROM table WHERE username = 'cc'");
    });

    it('update table where with key', () => {
        const sql = new SqlGenerator('update')
            .set({
                username: 1,
                password: 'username',
                update_at: 'CURRENT_DATE',
            })
            .from('table')
            .where({
                id: 'cd-s-cd-asfsd-g-fg',
            })
            .build();
        expect(sql).toBe(
            "UPDATE table SET username = 1, password = 'username', update_at = CURRENT_DATE WHERE id = 'cd-s-cd-asfsd-g-fg'",
        );
    });
});
