package main

import (
	"encoding/json"
	"log"
	"sync"
)

type joinResponse struct {
    Method      string      `json:"method"`
    Nickname    string      `json:"nickname"`
    Party       PartyInfo   `json:"party"`
}

type broadcastMessage struct {
    Method      string      `json:"method"`
    Nickname    string      `json:"nickname"`
}

type chatMessage struct {
    Method      string      `json:"method"`
    PartyId     string      `json:"partyId"`
    ClientId    string      `json:"clientId"`
    Message     string      `json:"message"`
    Nickname    string      `json:"nickname"`
}

type partyStatus struct {
    Id          string      `json:"id"`
    ClientId    string      `json:"clientId"`
    Playhead    float32     `json:"playhead"`
    IsPlaying   bool        `json:"isPlaying"`
}

func handleJoin(party PartyInfo, send chan []byte) {
    joinResp := joinResponse{
        Method: "join",
        Party: party,
    }
    msg, err := json.Marshal(joinResp)
    if err != nil {
        log.Printf("Error marshalling json %v", err)
        return
    }
    send <- msg
}

//func broadcastJoinOrLeave(method string, clients map[*Client] bool, c *Client) {
func broadcastJoinOrLeave(method string, clients *sync.Map, c *Client) {
    broadcastMessage := broadcastMessage{
        Method: method,
        Nickname: c.nickname,
    }
    msg, err := json.Marshal(broadcastMessage)
    if err != nil {
        log.Printf("Error marshalling json %v", err)
        return
    }

    clients.Range(func(key, value any) bool {
        // key is of type *Client wheras value is a bool
        if key.(*Client).id != c.id {
            key.(*Client).send <- msg
        }
        return true
    })
}

func broadcastChatMessage(msg wsMessage, c *Client) {
    data := chatMessage{
        Method: msg.Method,
        ClientId: msg.ClientId,
        Nickname: c.nickname,
        PartyId: msg.PartyId,
        Message: msg.Message,
    }
    resp, err := json.Marshal(data)
    if err != nil {
        log.Printf("Error marshalling json %v", err)
        return
    }
    c.party.broadcast <- resp
}

func broadcastWatchpartyStatus(p *Party) {
    data := partyStatus{
        Id: p.party.Id,
        ClientId: p.party.OwnerId,
        IsPlaying: p.party.IsPlaying,
        Playhead: p.party.Playhead,
    }
    resp, err := json.Marshal(data)
    if err != nil {
        log.Printf("Error marshalling json %v", err)
        return
    }
    p.broadcast <- resp
}
