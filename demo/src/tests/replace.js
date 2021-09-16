  import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  baseChild: childOrm,
  baseChildInner: {
    c: childOrm
  },
  baseChildArr: [childOrm],
  baseBase: baseOrm,
  baseBaseInner: {
    b: baseOrm
  },
  baseBaseArr: [baseOrm],
}), 'base')

const childOrm = orm(() => ({
  childBase: baseOrm,
  childBaseArr: [baseOrm],
  childBaseInner: {
    b: baseOrm
  },
  childChild: childOrm
}), 'child')

baseOrm.put({
  id: 1,
  baseChild: { id: 1 },
  baseChildInner: { 
    c: { id: 1, childChild: { id: 1 } } 
  },
  baseChildArr: [{ id: 1 }],
  baseBase: { id: 1 },
  baseBaseInner: { 
    b: { id: 2 } 
  },
  baseBaseArr: [{ id: 1 }]
})

baseOrm.put({
  id: 2,
  baseChild: { id: 2 },
  baseChildInner: {
    c: { id: 1 }
  },
  baseBaseInner: {
    b: { id: 1 }
  }
})

childOrm.put({
  id: 1,
  childBase: { id: 1 },
})

const prevBase = baseOrm.replace(1, 7)
const child = childOrm.replace(1, 7)
const base = baseOrm.get(7)
const base2 = baseOrm.get(2)

console.log(
  prevBase !== base,
  base === base.baseBase,
  base2 === base.baseBaseInner.b,
  base === base2.baseBaseInner.b,
  base === base.baseBaseArr[0],
  base === child.childBase,
  child === childOrm.get(7),
  child === child.childChild,
  child === base.baseChild,
  child === base.baseChildInner.c,
  child === base.baseChildArr[0]
)
console.log(window.z)
