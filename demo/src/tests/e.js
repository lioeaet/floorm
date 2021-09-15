  import { orm } from '*'
export default () => <div />

const baseOrm = orm(() => ({
  baseChild: childOrm,
  baseChildInner: {
    i: childOrm
  },
  baseChildArr: [childOrm],
  baseBase: baseOrm,
  baseBaseInner: {
    k: baseOrm
  },
  baseBaseArr: [baseOrm],
}), 'base')

const childOrm = orm(() => ({
  childBase: baseOrm,
  childBaseArr: [baseOrm],
  childBaseInner: {
    k: baseOrm
  }
}), 'child')

const base = baseOrm.put({
  id: 1,
  baseChild: {
    id: 1
  },
  baseChildInner: {
    i: { id: 1 }
  },
  baseChildArr: [{ id: 1 }],
  baseBase: { id: 1 },
  baseBaseInner: {
    k: { id: 1 }
  },
  baseBaseArr: [{ id: 1 }]
})

childOrm.put({
  id: 1,
  childBase: { id: 1 }/* ,
  childBaseArr: [{ id: 1 }, { id: 1 }],
  childBaseInner: {
    k: {
      childBaseInner: {
        id: 1
      }
    }
  } */
})
childOrm.put({ id: 1, childBase: null })

baseOrm.replace(1, 7)

childOrm.replace(1, 7)

// console.log(baseOrm.get(7).baseBaseArr[0] === baseOrm.get(7))
