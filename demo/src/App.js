import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  baseChild: childOrm
}), 'baseOrm')

const childOrm = orm(() => ({
  childBase: baseOrm,
  childBaseArr: [baseOrm],
  inner: {
    another: baseOrm
  }
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
  // childBaseArr: [{ id: 1, baseProp: 'x' }],
  // inner: {
  //   another: {
  //     id: 1,
  //     baseInner: 'in'
  //   }
  // }
}
// const child_2 = {
//   childBase: []
// }

// baseOrm.put(base.id, base)
// baseOrm.put(base.id, )

childOrm.put(child.id, child)
childOrm.put(child.id, { childBase: { id: 1, prop: 'someZ' } })
// childOrm.put(child.id, child_2)

console.log(childOrm.get(child.id))

// a: { b: { c: { prop1, prop2 } } }
// UPDATE GRANDPA
