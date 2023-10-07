package main

import (
	"encoding/json"
	"log"
)

type PartyInfo struct {
    Id          string      `json:"id"`
    OwnerId     string      `json:"ownerId"`
    Src         string      `json:"src"`
    Playhead    float32     `json:"playhead"`
}

type Party struct {
    party PartyInfo
    clients map[*Client]bool
    broadcast chan []byte
    join chan *Client
    leave chan *Client
}

func createParty(id string, ownerId string, src string) *Party {
    return &Party{
        party: PartyInfo{
            Id: id,
            OwnerId: ownerId,
            Src: src,
            Playhead: 0,
        },
        clients: make(map[*Client]bool),
        broadcast: make(chan []byte),
        join: make(chan *Client),
        leave: make(chan *Client),
    }
}

func (p *Party) run() {
    log.Println("watchparty " + p.party.Id + " live.")
    for {
        select {
        case client := <-p.join:
            log.Printf("%s joined.\n", client.nickname)
            p.clients[client] = true
            handleJoin(p.party, client.send)    // Send party details to newly joined client
            broadcastJoinOrLeave("new", p.clients, client)  // Send join notification to peers

        case client := <-p.leave:
            _, ok := p.clients[client]
            if ok {
                delete(p.clients, client)
                close(client.send)
                broadcastJoinOrLeave("leave", p.clients, client)  // Send join notification to peers
            }

        case message := <-p.broadcast:
            msg := wsMessage{}
            json.Unmarshal([]byte(message), &msg)
            for client := range p.clients {
                // Do not broadcast message back to the sender
                if msg.ClientId != client.id {
                    select {
                    case client.send <- message:
                    default:
                        close(client.send)
                        delete(p.clients, client)
                    }
                }
            }
        }
    }
}
