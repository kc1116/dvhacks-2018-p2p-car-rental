import React from 'react';
import ReactDOM from 'react-dom';
import {createNode} from './create-node';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import axios from 'axios';

import { Input, Button, Card, Icon, Image } from 'semantic-ui-react'

import 'react-chat-widget/lib/styles.css';

const PeerInfo = require('peer-info')
const PeerId = require('peer-id')
const pull = require('pull-stream')
const Pushable = require('pull-pushable')

const p = Pushable()
const cars = "http://127.0.0.1:8080/ipfs/QmUXeFB5TR6yB84WdPWXujijgKU8uiKFN3XHrAJspo9i1Q";
class Chatroom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            peerChatId: "", 
            p2pNode: null,
            cars: []
        }
    
        this.submitMessage = this.submitMessage.bind(this);
        this.handleNewUserMessage = this.handleNewUserMessage.bind(this);
        this.connect = this.connect.bind(this);
    }
    handleNewUserMessage = (newMessage) => {
        console.log(`New message incomig! ${newMessage}`);
        p.push(newMessage)
        
        // Now send the message throught the backend API
    }
    connect(){
        console.log(this.state.peerChatId)
        const idstr = this.state.peerChatId;
        const id = PeerId.createFromB58String(idstr);
        const peerInfo = new PeerInfo(id);
        const ma = `/dns4/star-signal.cloud.ipfs.team/tcp/443/wss/p2p-webrtc-star/ipfs/${idstr}`
        peerInfo.multiaddrs.add(ma)

        this.state.p2pNode.dialProtocol(peerInfo, '/chat/1.0.0', (err, conn) => {
            if (err) { return console.log('Failed to dial:', idstr) }
              console.log('nodeA dialed to nodeB on protocol: /chat/1.0.0')
              console.log('Type a message and see what happens')
              // Write operation. Data sent as a buffer
              pull(
                p,
                conn
              )
              // Sink, data converted from buffer to utf8 string
              pull(
                conn,
                pull.map((data) => {
                  return data.toString('utf8')
                }),
                pull.drain((data) => {
                    addResponseMessage(data);
                })
              )
        })
    }
    componentWillMount() {
        axios.get(cars)
        .then(res => {
            this.setState({cars: res.data.cars})
        });
        createNode((err, node) => {
            if (err) {
              console.log('Could not create the Node, check if your browser has WebRTC Support', err)
            }
            console.log(node)
            node.on('peer:connect', (peerInfo) => {
              const idStr = peerInfo.id.toB58String()
              console.log('Got connection to: ' + idStr)
            })
        
            node.on('peer:disconnect', (peerInfo) => {
              const idStr = peerInfo.id.toB58String()
              console.log('Lost connection to: ' + idStr)
            })
            
            node.handle('/chat/1.0.0', (protocol, conn) => {
                pull(
                  p,
                  conn
                )
          
                pull(
                  conn,
                  pull.map((data) => {
                    console.log(data)
                    return data.toString('utf8')
                  }),
                  pull.drain((data) => {
                      addResponseMessage(data);
                  })
                )

                this.setState({peerChatId: 'chatting'})
              })
            node.start((err) => {
              if (err) {
                console.log('WebRTC not supported')
              }
        
              const idStr = node.peerInfo.id.toB58String()
                
              console.log('Node is listening o/', idStr)
        
              // NOTE: to stop the node
              // node.stop((err) => {})
              this.setState({p2pNode: node, peerChatId: ""})
            })
          })
    }

    submitMessage(e) {
        e.preventDefault();

        this.setState({
            chats: this.state.chats.concat([{
                username: "Kevin Hsu",
                content: <p>{ReactDOM.findDOMNode(this.refs.msg).value}</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }])
        }, () => {
            ReactDOM.findDOMNode(this.refs.msg).value = "";
        });
    }

    render() {
        return (
            <div className="chatroom">

                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <h1>Your Peer ID {this.state.p2pNode ? this.state.p2pNode.idStr: "Connecting . . ."}</h1>
                    <Input type='text' onChange={((e) => this.setState({peerChatId: e.currentTarget.value}))} placeholder='Enter PeerId to chat...' action>
                        <input />
                        <Button type='submit' onClick={this.connect}>Connect</Button>
                    </Input>
                    <div style={{display: 'flex', alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between'}}>
                        {this.state.cars.map((car, i) => {
                            return (
                                <Card style={{padding: 10}} key={i}>
                                    <Image src={car.image} />
                                    <Card.Content>
                                    <Card.Header>
                                        {car.title}
                                    </Card.Header>
                                    <Card.Description>
                                        {car.description}
                                    </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                    <a>
                                        <Icon name='dollar' />
                                        {car.price}
                                    </a>
                                    </Card.Content>
                                </Card>
                            )
                        })}
                    </div>
                </div>
                <Widget
                    handleNewUserMessage={this.handleNewUserMessage}
                    title="P2P Chat"
                    subtitle={this.state.peerChatId === "" ? "Not connected": this.state.peerChatId}
                />
            </div>
        );
    }
}

export default Chatroom;