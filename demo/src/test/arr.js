import { orm, door } from '*'
export default () => <div />

const baseOrm = orm('base', () => ({
  ok: diff => diff.hasOwnProperty('stork') ? baseOrm : arrOrm
}))

const arrOrm = orm(() => ({ arr: [baseOrm] }), 'arr')

const arrDoor = door(arrOrm)
const baseDoor = door(baseOrm)

baseDoor.put({ id: 1, ok: { id: 1, stork: true, fromOk: true } })

arrDoor.put({ id: 1, arr: [{ id: 1, bla: 'bla' }, { id: 1, bla: 'bla' }] })

baseDoor.put({ id: 1, bla: 'bla bla bla' })

console.log(baseDoor.get(1), arrDoor.get(1))
