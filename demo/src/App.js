import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  baseChild: childOrm
}), 'base')

const childOrm = orm(() => ({
  childBase: baseOrm,
  childBaseArr: [baseOrm],
  childInner: {
    childBaseInner: baseOrm
  }
}), 'child')

baseOrm.put({
  id: 1,
  baseChild: {
    id: 1
  }
})

childOrm.put({
  id: 1,
  childBaseArr: [{ id: 2, bla: 'ok' }, { id: 1, ok: 'bla' }, {id: 3, oesifj: 'pseo'}]
})

childOrm.put({
  id: 1,
  childBase: {
    id: 1,
    basePropY: 'y'
  },
  childBaseArr: [{ id: 1, basePropArr: 'x' }, { id: 2, ea: 'ok' }, { id: 1, iaesu: 'ase' }],
  childInner: {
    childBaseInner: {
      id: 1,
      basePropInner: 'z'
    }
  }
})

baseOrm.put({ id: 1, basePropArr: 'changed basePropArr' })

console.log(
  baseOrm.get(1) === childOrm.get(1).childBase,
  baseOrm.get(1) === childOrm.get(1).childBaseArr[0],
  baseOrm.get(1) === childOrm.get(1).childInner.childBaseInner,
  baseOrm.get(1).baseChild === childOrm.get(1),
  childOrm.get(1).childBaseArr[0] === childOrm.get(1).childBaseArr[2]
)
