import q from 'q'
import ACTIVITIY_STATUS from './activityStatus'

const ipcRenderer = window.require('electron').ipcRenderer

// TODO dont do ipcRenderer.on calls without cleaning them up afterwards

class IPCAdapter {
  constructor (ipcRenderer) {
    this.ipcRenderer = ipcRenderer
  }

  getHubs () {
    const deferred = q.defer()

    this.ipcRenderer.send('IPCAdapter', { topic: 'getHubs' })
    this.ipcRenderer.on('IPCAdapter', function (event, envelope) {
      if (envelope.topic === 'getHubs-reply' && Array.isArray(envelope.hubs)) {
        deferred.resolve(envelope.hubs)
      }
    })

    return deferred.promise
  }

  getActivities (hubUuid) {
    const deferredGetActivities = q.defer()
    const deferredGetCurrentActivityForHub = q.defer()

    ipcRenderer.send('IPCAdapter', { topic: 'getActivities', hubUuid: hubUuid })
    ipcRenderer.send('IPCAdapter', { topic: 'getCurrentActivityForHub', hubUuid: hubUuid })

    ipcRenderer.on('IPCAdapter', function (event, envelope) {
      const { topic } = envelope

      if (topic === 'getActivities-reply' && envelope.hubUuid && Array.isArray(envelope.activities)) {
        deferredGetActivities.resolve(envelope.activities)
      } else if (topic === 'getCurrentActivityForHub-reply') {
        deferredGetCurrentActivityForHub.resolve(envelope.activityId)
      }
    })

    return q.all([
      deferredGetActivities.promise,
      deferredGetCurrentActivityForHub.promise
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
    ipcRenderer.send('IPCAdapter', {
      topic: 'startActivityForHub',
      hubUuid: hubUuid,
      activityId: activityId
    })

    return q.when()
  }
}

const ipcAdapter = new IPCAdapter(ipcRenderer)
export default ipcAdapter
