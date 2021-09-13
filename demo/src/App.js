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
    id: 1
  },
  baseBaseArr: [{ id: 2, la: 'la', a: 'a' }, { id: 1 }]
})
const child1_1 = childOrm.get(1)
const base2_1 = baseOrm.get(2)

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

const child1_3 = childOrm.put({
  id: 1,
  childBase: { id: 1 },
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

baseOrm.remove(1)
