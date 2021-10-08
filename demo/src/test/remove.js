import { orm } from '*'
export default () => <div />

const baseOrm = orm('base', () => ({
  baseChild: childOrm,
  baseBaseArr: [baseOrm]
}))

const childOrm = orm('child', () => ({
  childBase: baseOrm,
  childBaseArr: [baseOrm],
  childInner: {
    k: {
      childBaseInner: baseOrm
    }
  }
}))

baseOrm.put({
  id: 1,
  baseChild: {
    id: 1
  },
  baseBaseArr: [{ id: 1 }]
})

childOrm.put({
  id: 1,
  childBase: { id: 1 },
  childBaseArr: [{ id: 1 }, { id: 1 }],
  childInner: {
    k: {
      childBaseInner: {
        id: 1
      }
    }
  }
})

baseOrm.remove(1)

console.log('oki')
