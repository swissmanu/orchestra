import ACTIVITIY_STATUS from './activityStatus'
const IPCResponder = require('electron-ipc-responder')

const ipcRenderer = window.require('electron').ipcRenderer

class ClientIPCAdapter extends IPCResponder {
  constructor (ipcRenderer) {
    super(ipcRenderer.send.bind(ipcRenderer), ipcRenderer.on.bind(ipcRenderer))
  }

  getHubs () {
    return this.ask('getHubs').then((response) => response.hubs)
  }

  getActivities (hubUuid) {
    return Promise.all([
      this.ask('getActivities', { hubUuid }),
      this.ask('getCurrentActivityForHub', { hubUuid })
    ])
      .then((results) => {
        const activities = results[0].activities
        const currentActivityId = results[1].activityId

        return activities.map((activity) => {
          if (activity.id !== '-1' && activity.id === currentActivityId) {
            activity.activityStatus = ACTIVITIY_STATUS.STARTED
          } else {
            activity.activityStatus = ACTIVITIY_STATUS.OFF
          }

          return activity
        })
      })
  }

  startActivityForHub (activityId, hubUuid) {
    return this.tell('startActivityForHub', { hubUuid, activityId })
  }

  executeControlAction (action, hubUuid) {
    return this.tell('executeControlAction', { action, hubUuid })
  }
}

const ipcAdapter = new ClientIPCAdapter(ipcRenderer)
export default ipcAdapter
