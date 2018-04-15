# dvhacks-2018-p2p-car-rental
This repo demonstrates adding P2P functionality to some aspects of a car sharing economy. Namely Peer communication, data storage, and booking

# Usage UI Dir

Install IPFS and run it 

```sh
$ brew install ipfs
$ ipfs daemon
```

Now that we can fetch from our distributed storage run our example app dev server
```sh 
$ npm run start
```

Now visit localhost:3000 in the browser :) 

Open up same url in an incognito browser, copy the peer id, and use it in your other browser for input to the enter peer id form input. This will let you chat between browsers, this should work with different machines on different networks also.

# Overview

The problem with shared economies is the middle man. The middle man acts as a gatekeeper and landlord where the underlying IT infrstructure of the economy is the real estate and the participants are the tenants, the connection between participants is where the gatekeeping happens. This gives the middle man dispproportionate leverage over participants, and enables them to generate money by charging fees for managing this over infrastructure. 

    P -> MM -> P 

We want to design a true P2P economy where we remove the middle man and fees, maximizing profits for renters subsequently driving the value of the entire economy up and opening various other revenue opportunities for the software owners. With the advancements being made in P2P networking, distributed computing,distributed ledgers, IOT, and blockchain, we now have the resources available to us to achieve our goal of a feeless shared economy. We will attack this problem by adding more autonomy around various interactions between peers, thus minizing the amount of infrastructure that exists and making the infrastructure more self supporting. In this demo we focus on the areas of vehicle data storage, peer discovery, and communication. We will store some data on IPFS distributed storage and display it available rentals, and we will also use WebRTC and libP2P to communicate between peers for free.

# Architecture 

Each peer will have a key pair to authenticate and encrypt data. Cars will act as peers them selves, utilizing a chat bot to represent themselves. We will use IPFS for decentralized storage of data and a digital currency to handle payment. We will also track vehicle data through OBD 2 port for rental owners. 