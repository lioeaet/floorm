import { orm, door } from '*'
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

const baseDoor = door(baseOrm)
const childDoor = door(childOrm)

baseDoor.put({
  id: 1,
  baseChild: {
    id: 1
  },
  baseBaseArr: [{ id: 1 }]
})

childDoor.put({
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

baseDoor.remove(1)

console.log('oki')
