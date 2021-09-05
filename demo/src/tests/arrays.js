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
  childBaseArr: [{ id: 1, baseProp: 'x' }, { id: 2, baseProp: 'y' }, { id: 3, baseProp: 'z' }],
}
// const child_2 = {
//   childBase: []
// }

// baseOrm.put(base)
// baseOrm.put()

childOrm.put(child)
childOrm.put({
  id: 1,
  childBaseArr: [{ id: 2, baseProp: 'yz' }, { id: 1, baseProp: 'x' }]
})
// childOrm.put(child_2)

// console.log(baseOrm.get(base.id), childOrm.get(1))

// a: { b: { c: { prop1, prop2 } } }
// UPDATE GRANDPA
