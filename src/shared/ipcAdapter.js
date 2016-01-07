'use strict'

const isString = require('amp-is-string')
const q = require('q')
const uuid = require('node-uuid')
const IPCAdapterChannel = 'IPCAdapter'

// TODO extract in own npm module?

/**
 * The IPCAdapter base class allows to implement a communication partner for
 * inter process communication. This was developed with Electron in mind. See
 * following examples for a short overview.
 *
 * @example <caption>Create IPCAdapter in Host Process</caption>
 * const electron = require('electron')
 * let mainWindow = new electron.BrowserWindow()
 * const ipcMain = electron.ipcMain
 * const webContents = mainWindow.webContents
 *
 * class HostIPCAdapter extends IPCAdapter {
 *   constructor() {
 *     super(webContents.send.bind(webContents), ipcMain.on.bind(ipcMain))
 *
 *     this.registerTopic('hello', (payload) => {
 *       text: 'hello ' + payload.name + ' too'
 *     })
 *   }
 * }
 * @example <caption>Create IPCAdapter in Renderer Process</caption>
 * const ipcRenderer = window.require('electron').ipcRenderer
 *
 * class RendererIPCAdapter extends IPCAdapter {
 *   constructor() {
 *     super(ipcRenderer.send.bind(ipcRenderer), ipcRenderer.on.bind(ipcRenderer))
 *   }
 *
 *   sayHelloToHost(name) {
 *     this.ask('hello', { name }, (payload) => payload.name)
 *   }
 * }
 */
class IPCAdapter {

  /**
   * Creates a new IPCAdapter and sets up the communication stack.
   *
   * @param  {function} send A function that allows sending an event via the
   *                         IPC infrastructure.
   * @param  {function} on A function that allows setting up a listener on the
   *                       IPC infrastructure.
   */
  constructor (send, on) {
    this.send = send
    this.topicHandlers = {}
    this.awaitingResponseHandlers = {}

    on(IPCAdapterChannel, (event, envelope) => {
      const topic = envelope.topic
      const id = envelope.id
      const payload = envelope.payload

      if (isString(topic) && topic.length > 0 && this.topicHandlers[topic] != null) {
        // Handle incoming request for topic:
        this.topicHandlers[topic](payload)
          .then((responsePayload) => {
            event.sender.send(IPCAdapterChannel, { id, payload: responsePayload })
          })
      } else if (isString(id) && id.length > 0 && this.awaitingResponseHandlers[id] != null) {
        // Handle a response we are waiting for:
        this.awaitingResponseHandlers[id].deferred.resolve(payload)
        delete this.awaitingResponseHandlers[id]
      }
    })
  }

  /**
   * Register a topic which this IPCAdapter should be able to call upon. Given
   * handler function has to return a promise.
   *
   * @param  {string} topic - Name of the topic to register
   * @param  {function} handler - Handler function to register for given topic
   * @return {promise} containing the response to send to the caller
   */
  registerTopic (topic, handler) {
    this.topicHandlers[topic] = handler
  }

  /**
   * Request a response for given topic of the counterparty. The payload
   * parameter will be sent along with your request. The processResponsePayload
   * function allows you to process the returned response before exposing it.
   *
   * @param  {string} topic Topic to request response for
   * @param  {object} payload Data to send to the counterparty. This is
   *                          optional. Default is undefined. You can pass
   *                          processResponsePayload instead of payload for a
   *                          shorter function call signature.
   * @param  {function} processResponsePayload Function to process returned
   *                                           response with. This is
   *                                           optional.
   *                                           Default will just return the
   *                                           response from the counterparty.
   * @return {promise} that resolves with the value processResponsePayload
   *                   returns
   */
  ask (topic, payload, processResponsePayload) {
    const deferred = q.defer()
    const id = uuid.v4()
    const timestamp = new Date()

    if (processResponsePayload == null) {
      processResponsePayload = (payload) => payload
    }

    // If a function was given as payload simply assume that we should use that
    // function as processResponsePayload:
    if (typeof (payload) === 'function') {
      processResponsePayload = payload
    }

    this.awaitingResponseHandlers[id] = { deferred, id, timestamp }
    this.send(IPCAdapterChannel, { id, topic, payload })

    return deferred.promise
      .then((payload) => processResponsePayload(payload))
  }

  /**
   * Same as ask, tell allows to send a request to the communication
   * counterparty. Instead expecting a response, this is "fire and forget". So
   * the returned promise will get resolved immediately, no matter what the
   * other side returns (if it returns anything at all).
   *
   * @param  {string} topic Topic to request response for
   * @param  {object} payload Data to send to the counterparty. This is
   *                          optional. Default is undefined. You can pass
   *                          processResponsePayload instead of payload for a
   *                          shorter function call signature.
   * @return {promise} that gets resolved immediately after the request was sent
   */
  tell (topic, payload) {
    const id = uuid.v4()
    this.send(IPCAdapterChannel, { id, topic, payload })
    return q.when()
  }
}

module.exports = IPCAdapter
