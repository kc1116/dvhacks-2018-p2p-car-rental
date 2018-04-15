const WebRTCStar = require('libp2p-webrtc-star')
const WebSockets = require('libp2p-websockets')

const Mplex = require('libp2p-mplex')
const SPDY = require('libp2p-spdy')
const SECIO = require('libp2p-secio')

const Railing = require('libp2p-railing')
const libp2p = require('libp2p')

// Find this list at:
// https://github.com/ipfs/js-ipfs/blob/master/src/core/runtime/config-browser.js
// on
const bootstrapers = [
  '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6D' +
      'ifTC88f5uVQKNAd',
  '/dns4/sfo-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAz' +
      'b1kShaanJgW36yx',
  '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6' +
      'wYtsMGLzSr5QBU3',
  '/dns4/sfo-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZ' +
      'uTdDWP8HXaHca9z',
  '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3' +
      'aZ6ha4oFGL1KrGM',
  '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88' +
      'CNLHXMkTNwMKPnu',
  '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcr' +
      'NFTDAadQJmocnWm',
  '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXM' +
      'JDAbzgu2fzaDs64',
  '/dns4/wss0.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34p' +
      'WjZ1kZvsd16Zic',
  '/dns4/wss1.bootstrap.libp2p.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2Q' +
      'JPhwDJzJyGFsD6'
]

const NewNode = (peerInfo, peerBook, options) => {
  const wstar = new WebRTCStar()
  options = options || {}

  const modules = {
    transport: [
      wstar, new WebSockets()
    ],
    connection: {
      muxer: [
        Mplex, SPDY
      ],
      crypto: [SECIO]
    },
    discovery: [wstar.discovery, new Railing(bootstrapers)]
  }

  return new libp2p(modules, peerInfo, peerBook, options)
}


export default NewNode;