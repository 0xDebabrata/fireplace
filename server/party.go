package main

import (
	"encoding/json"
	"log"
	"sync"
	"time"
)

type PartyInfo struct {
	Id        string  `json:"id"`
	OwnerId   string  `json:"ownerId"`
	Src       string  `json:"src"`
	Playhead  float32 `json:"playhead"`
	IsPlaying bool    `json:"isPlaying"`
}

type Party struct {
	party PartyInfo
	//clients map[*Client]bool
	clients   sync.Map
	broadcast chan []byte
	join      chan *Client
	leave     chan *Client
}

func createParty(id string, ownerId string, src string) *Party {
	return &Party{
		party: PartyInfo{
			Id:        id,
			OwnerId:   ownerId,
			Src:       src,
			Playhead:  0,
			IsPlaying: false,
		},
		//clients: make(map[*Client]bool),
		clients:   sync.Map{},
		broadcast: make(chan []byte),
		join:      make(chan *Client),
		leave:     make(chan *Client),
	}
}

func (p *Party) run() {
	log.Println("watchparty " + p.party.Id + " live.")

	done := make(chan bool)
	go p.broadcastStatus(done)

	// watchparty will be terminated after this ticker ticks
	ticker := time.NewTicker(24 * time.Hour)
	defer func() {
		log.Printf("Party %s terminated", p.party.Id)
		watchparties.Delete(p.party.Id)		// Remove watchparty from map
		done <- true  // close broadcastStatus goroutine
		ticker.Stop() // close watchparty
	}()

	for {
		select {
		case client := <-p.join:
			log.Printf("%s joined.\n", client.nickname)
			//p.clients[client] = true
			p.clients.Store(client, true)
			handleJoin(p.party, client.send)                // Send party details to newly joined client
			broadcastJoinOrLeave("new", &p.clients, client) // Send join notification to peers

		case client := <-p.leave:
			//_, ok := p.clients[client]
			_, ok := p.clients.Load(client)
			if ok {
				//delete(p.clients, client)
				p.clients.Delete(client)
				close(client.send)
				broadcastJoinOrLeave("leave", &p.clients, client) // Send join notification to peers
			}

		case message := <-p.broadcast:
			msg := wsMessage{}
			json.Unmarshal([]byte(message), &msg)
			p.clients.Range(func(key, value any) bool {
				// Do not broadcast message back to the sender
				if msg.ClientId != key.(*Client).id {
					select {
					case key.(*Client).send <- message:
					default:
						close(key.(*Client).send)
						//delete(p.clients, client)
						p.clients.Delete(key)
					}
				}
				return true
			})

		case <-ticker.C:
			// close the party after 24 hours
			return
		}

	}
}

func (p *Party) broadcastStatus(done chan bool) {
	ticker := time.NewTicker(2000 * time.Millisecond)

	defer func() {
		ticker.Stop()
	}()

	for {
		select {
		case <-done:
			return
		case <-ticker.C:
			broadcastWatchpartyStatus(p)
		}
	}
}
