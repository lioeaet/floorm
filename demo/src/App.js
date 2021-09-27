import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  baseChild: childOrm,
  baseBaseArr: [baseOrm]
}), 'base')

const childOrm = orm(() => ({
  childBase: baseOrm,
  childBaseArr: [baseOrm],
  childInner: {
    k: {
      childBaseInner: baseOrm
    }
  }
}), 'child')

const base1_1 = baseOrm.put({
  id: 1,
  baseChild: {
    id: 1,
    childBase: { id: 1, fromBaseChild: 'x' }
  },
  baseBaseArr: [{ id: 2, la: 'la', a: 'a' }, { id: 1 }]
})
const child1_1 = childOrm.get(1)
const base2_1 = baseOrm.get(2)
console.log(
  base1_1 === baseOrm.get(1),
  base1_1.fromBaseChild === 'x',
  base1_1.baseBaseArr[0] === base2_1,
  base1_1.baseBaseArr[1] === base1_1,
  base1_1.baseBaseArr.length === 2,
  base1_1.baseChild === child1_1,
  Object.keys(base1_1).length === 4,

  base2_1.a === 'a',
  base2_1.la === 'la',
  Object.keys(base2_1).length === 3,

  child1_1.childBase === base1_1,
  Object.keys(child1_1).length === 2
)

const child1_2 = childOrm.put({
  id: 1,
  childBaseArr: [{ id: 2, la: 'ok' }, { id: 1, la: 'ok' }, {id: 3, la: 'eo'}],
  childInner: {
    k: {
      childBaseInner: {
        id: 1,
        basePropInner: 'z'
      }
    }
  }
})
const base1_2 = baseOrm.get(1)
const base2_2 = baseOrm.get(2)
const base3_2 = baseOrm.get(3)
console.log(
  base1_2 !== base1_1,
  base1_2.fromBaseChild === 'x',
  base1_2.la === 'ok',
  base1_2.basePropInner === 'z',
  base1_2.baseBaseArr[0] === base2_2,
  base1_2.baseBaseArr[1] === base1_2,
  base1_2.baseBaseArr.length === 2,
  base1_2.baseChild === child1_2,
  Object.keys(base1_2).length === 6,

  base2_2 !== base2_1,
  base2_2.a === 'a',
  base2_2.la === 'ok',
  Object.keys(base2_2).length === 3,

  base3_2.la === 'eo',
  Object.keys(base3_2).length === 2,

  child1_2 !== child1_1,
  child1_2.childBase === base1_2,
  child1_2.childBaseArr[0] === base2_2,
  child1_2.childBaseArr[1] === base1_2,
  child1_2.childBaseArr[2] === base3_2,
  child1_2.childBaseArr.length === 3,
  child1_2.childInner.k.childBaseInner === base1_2,
  Object.keys(child1_2.childInner).length === 1,
  Object.keys(child1_2.childInner.k).length === 1,
  Object.keys(child1_2).length === 4
)

const child1_3 = childOrm.put({
  id: 1,
  childBase: null,
  childBaseArr: [{ id: 1 }, { id: 1 }],
  childInner: {
    k: {
      childBaseInner: {
        id: 1,
        basePropInner: 'changed z'
      }
    }
  }
})
const base1_3 = baseOrm.get(1)
const base2_3 = baseOrm.get(2)
const base3_3 = baseOrm.get(3)
console.log(
  base1_3 !== base1_1,
  base1_2 !== base1_1,
  base1_3.la === 'ok',
  base1_3.fromBaseChild === 'x',
  base1_3.basePropInner === 'changed z',
  base1_3.baseBaseArr[0] === base2_3,
  base1_3.baseBaseArr[1] === base1_3,
  base1_3.baseBaseArr.length === 2,
  base1_3.baseChild === child1_3,
  Object.keys(base1_2).length === 6,

  base2_3 === base2_2,
  base3_3 === base3_2,

  child1_3 !== child1_1,
  child1_3 !== child1_2,
  child1_3.childBase === null,
  child1_3.childBaseArr[0] === base1_3,
  child1_3.childBaseArr[1] === base1_3,
  child1_3.childBaseArr.length === 2,
  child1_3.childInner !== child1_2.childInner,
  child1_3.childInner.k !== child1_2.childInner.k,
  child1_3.childInner.k.childBaseInner === base1_3,
  Object.keys(child1_3.childInner).length === 1,
  Object.keys(child1_3.childInner.k).length === 1,
  Object.keys(child1_3).length === 4
)

console.log(window.z)
