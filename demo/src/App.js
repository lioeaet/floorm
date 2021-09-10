import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  baseChild: childOrm
}), 'base')

const childOrm = orm(() => ({
  childBaseArr: [baseOrm]
}), 'child')

baseOrm.put({
  id: 1,
  baseChild: { id: 1 }
})
childOrm.put({
  id: 1,
  childBaseArr: [{ id: 1, baseFromArr: 'yz' }]
})

baseOrm.put({ id: 1, awiubdaw: 'als' })

console.log(baseOrm.get(1).baseChild, childOrm.get(1), baseOrm.get(1).baseChild === childOrm.get(1))
