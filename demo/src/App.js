import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  child: childOrm
}), 'baseOrm')

const childOrm = orm(() => ({
  // base: baseOrm,
  // baseArr: [baseOrm]
}), 'childOrm')

const base = {
  id: 1,
  child: {
    id: 1
  }
}

const child = {
  id: 1,
  prop: 'prop'
}

baseOrm.put(base.id, base)

// console.log(baseOrm.get(base.id))
// console.log(childOrm.get(child.id))

childOrm.put(child.id, child)

// console.log(baseOrm.get(base.id))
// console.log(childOrm.get(child.id))
