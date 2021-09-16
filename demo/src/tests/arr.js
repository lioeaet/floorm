import { orm } from '*'
export default () => <div />

const arrOrm = orm(() => ([baseOrm]), 'arrOrm')

const baseOrm = orm(() => ({}), 'child')

baseOrm.put({ id: 1, bla: 1 })

arrOrm.put([{ id: 1, bla: 'bla' }, {id: 2, bla: 'ok'}])
