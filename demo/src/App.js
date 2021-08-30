import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  baseChild: childOrm
}), 'baseOrm')

const childOrm = orm(() => ({
  childBase: baseOrm,
  childBaseArr: [baseOrm]
}), 'childOrm')

const base = {
  id: 1,
  baseChild: {
    id: 1
  }
}

const child = {
  id: 1,
  prop: 'prop',
  childBase: {
    id: 1,
    basePropY: 'y'
  },
  childBaseArr: [{ id: 1, baseProp: 'x' }]
}

baseOrm.put(base.id, base)

// console.log(baseOrm.get(base.id))

childOrm.put(child.id, child)

console.log(baseOrm.get(base.id))
console.log(childOrm.get(child.id))


// a: { b: { c: { prop1, prop2 } } }
// UPDATE GRANDPA
