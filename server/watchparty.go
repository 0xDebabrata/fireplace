package main

import (
	"encoding/json"
	"log"
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

func broadcastJoinOrLeave(method string, clients map[*Client] bool, c *Client) {
    broadcastMessage := broadcastMessage{
        Method: method,
        Nickname: c.nickname,
    }
    msg, err := json.Marshal(broadcastMessage)
    if err != nil {
        log.Printf("Error marshalling json %v", err)
        return
    }
    for client := range clients {
        if client.id != c.id {
            client.send <- msg
        }
    }
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
