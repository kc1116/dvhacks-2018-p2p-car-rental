import NewNode from './libp2p-vendor'

const PeerInfo = require('peer-info')

export const createNode = (callback) => {
  PeerInfo.create((err, peerInfo) => {
    if (err) {
      return callback(err)
    }

    const peerIdStr = peerInfo.id.toB58String()
    const ma = `/dns4/star-signal.cloud.ipfs.team/tcp/443/wss/p2p-webrtc-star/ipfs/${peerIdStr}`

    peerInfo.multiaddrs.add(ma)

    const node = NewNode(peerInfo)

    node.idStr = peerIdStr
    callback(null, node)
  })
}

