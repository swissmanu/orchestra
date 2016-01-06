import q from 'q'
import ACTIVITIY_STATUS from './activityStatus'
import IPCAdapter from '../../shared/ipcAdapter'

const ipcRenderer = window.require('electron').ipcRenderer

class ClientIPCAdapter extends IPCAdapter {
  constructor (ipcRenderer) {
    super(ipcRenderer.send.bind(ipcRenderer), ipcRenderer.on.bind(ipcRenderer))
    this.ipcRenderer = ipcRenderer
  }

  getHubs () {
    return this.ask('getHubs', (response) => response.hubs)
  }

  getActivities (hubUuid) {
    return q.all([
      this.ask('getActivities', { hubUuid }, (response) => response.activities),
      this.ask('getCurrentActivityForHub', { hubUuid }, (response) => response.activityId)
    ])
      .then((results) => {
        const activities = results[0]
        const currentActivityId = results[1]

        return activities.map((activity) => {
          if (activity.id === currentActivityId) {
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
}

const ipcAdapter = new ClientIPCAdapter(ipcRenderer)
export default ipcAdapter
