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

baseOrm.put({
  id: 1,
  baseChild: {
    id: 1
  },
  baseBaseArr: [{ id: 2, bla: 'bla', a: 'a' }, { id: 1 }]
})

console.log(
  baseOrm.get(1) === baseOrm.get(1).baseBaseArr[1],
  baseOrm.get(1).baseChild === childOrm.get(1),
  Object.keys(baseOrm.get(1)) === 3,
  Object.keys(baseOrm.get(1).baseChild) === 1,

  baseOrm.get(1).baseBaseArr.length === 2,
  baseOrm.get(2).bla === 'bla',
  baseOrm.get(2).a === 'a',
  Object.keys(baseOrm.get(2)) === 3
)

childOrm.put({
  id: 1,
  childBaseArr: [{ id: 2, bla: 'ok' }, { id: 1, ok: 'bla' }, {id: 3, oesifj: 'pseo'}],
  childInner: {
    k: {
      childBaseInner: {
        id: 1,
        basePropInner: 'z'
      }
    }
  }
})

console.log(
  baseOrm.get(1) === baseOrm.get(1).baseBaseArr[1],
  baseOrm.get(1) === childOrm.get(1).childInner.k.childBaseInner,
  baseOrm.get(1).baseChild === childOrm.get(1),
  baseOrm.get(2).bla === 'ok',
  baseOrm.get(3).oesifj === 'pseo'
)

childOrm.put({
  id: 1,
  childBase: {
    id: 1,
    basePropY: 'y'
  },
  childBaseArr: [{ id: 1, basePropArr: 'x' }, { id: 1, ea: 'ok' }],
  childInner: {
    k: {
      childBaseInner: {
        id: 1,
        basePropInner: 'changed z'
      }
    }
  }
})

baseOrm.put({
  id: 1,
  ok: 'changed ok',
  awfui: 'oisa',
  baseBaseArr: [{ id: 2, oesifj: 'esfuib' }, { bla: 'bla', id: 1 }]
})

console.log(
  baseOrm.get(1) === childOrm.get(1).childBase,
  baseOrm.get(1) === childOrm.get(1).childBaseArr[0],
  baseOrm.get(1) === childOrm.get(1).childInner.k.childBaseInner,
  baseOrm.get(1).baseChild === childOrm.get(1),
  baseOrm.get(1) === baseOrm.get(1).baseBaseArr[1],
  childOrm.get(1).childBaseArr[0] === childOrm.get(1).childBaseArr[1],
  baseOrm.get(2) === baseOrm.get(1).baseBaseArr[0]
)
