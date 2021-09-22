import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  ok: diff => diff.hasOwnProperty('stork') ? baseOrm : arrOrm
}), 'base')

const arrOrm = orm(() => ({ arr: [baseOrm] }), 'arr')

baseOrm.put({ id: 1, ok: { id: 1, stork: true, fromOk: true } })

arrOrm.put({ id: 1, arr: [{ id: 1, bla: 'bla' }, { id: 1, bla: 'bla' }] })

baseOrm.put({ id: 1, bla: 'bla bla bla' })

console.log(baseOrm.get(1), arrOrm.get(1))
