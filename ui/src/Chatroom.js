import React from 'react';
import ReactDOM from 'react-dom';
import {createNode} from './webrtc/create-node';
import './App.css';

import Message from './Message.js';

class Chatroom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            p2pNode: null,
            chats: [{
                username: "Kevin Hsu",
                content: <p>Hello World!</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                username: "Alice Chen",
                content: <p>Love it! :heart:</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                username: "Kevin Hsu",
                content: <p>Check out my Github at https://github.com/WigoHunter</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                username: "KevHs",
                content: <p>Lorem ipsum dolor sit amet, nibh ipsum. Cum class sem inceptos incidunt sed sed. Tempus wisi enim id, arcu sed lectus aliquam, nulla vitae est bibendum molestie elit risus.</p>,
                img: "http://i.imgur.com/ARbQZix.jpg",
            }, {
                username: "Kevin Hsu",
                content: <p>So</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                username: "Kevin Hsu",
                content: <p>Chilltime is going to be an app for you to view videos with friends</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                username: "Kevin Hsu",
                content: <p>You can sign-up now to try out our private beta!</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                username: "Alice Chen",
                content: <p>Definitely! Sounds great!</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }]
        };

        this.submitMessage = this.submitMessage.bind(this);
    }

    componentWillMount() {
        createNode((err, node) => {
            if (err) {
              console.log('Could not create the Node, check if your browser has WebRTC Support', err)
            }
        
            node.on('peer:discovery', (peerInfo) => {
              console.log('Discovered a peer')
              const idStr = peerInfo.id.toB58String()
              console.log('Discovered: ' + idStr)
        
              node.dial(peerInfo, (err, conn) => {
                if (err) { return console.log('Failed to dial:', idStr) }
              })
            })
        
            node.on('peer:connect', (peerInfo) => {
              const idStr = peerInfo.id.toB58String()
              console.log('Got connection to: ' + idStr)
            })
        
            node.on('peer:disconnect', (peerInfo) => {
              const idStr = peerInfo.id.toB58String()
              console.log('Lost connection to: ' + idStr)
            })
        
            node.start((err) => {
              if (err) {
                console.log('WebRTC not supported')
              }
        
              const idStr = node.peerInfo.id.toB58String()
                
              console.log('Node is listening o/', idStr)
        
              // NOTE: to stop the node
              // node.stop((err) => {})
              this.setState({p2pNode: node})
            })
          })
    }

    componentDidMount() {
        this.scrollToBot();
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot() {
        ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
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
        const username = "Kevin Hsu";
        const { chats } = this.state;

        return (
            <div className="chatroom">
                <h3>Chilltime</h3>
                <ul className="chats" ref="chats">
                    {
                        chats.map((chat) => 
                            <Message chat={chat} user={username} />
                        )
                    }
                </ul>
                <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                    <input type="text" ref="msg" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default Chatroom;