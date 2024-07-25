package main

import (
	"encoding/json"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	id       string
	conn     *websocket.Conn
	nickname string
	send     chan []byte
	party    *Party
}

type wsMessage struct {
	Method   string  `json:"method"`
	PartyId  string  `json:"partyId"`
	ClientId string  `json:"clientId"`
	Message  string  `json:"message"`
	Nickname string  `json:"nickname"`
	Playhead float32 `json:"playhead"`
}

const (
	writeWait  = 15 * time.Second // Time allowed to write message to a peer.
	pingPeriod = 30 * time.Second // Delay b/w ping messages to peers.
)

func initClient(id string, conn *websocket.Conn, party *Party) *Client {
	return &Client{
		id:    id,
		conn:  conn,
		party: party,
		send:  make(chan []byte),
	}
}

func (c *Client) readPump() {
	defer func() {
		c.party.leave <- c
		c.conn.Close()
	}()

	for {
		messageType, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("unexpected close error: %v", err)
			}
			log.Printf("websocket connection close error: %s", err.Error())
			break
		}

		// Received text message
		// Reference: https://www.rfc-editor.org/rfc/rfc6455.html#section-11.8
		if messageType == websocket.TextMessage {
			msg := wsMessage{}
			json.Unmarshal([]byte(message), &msg)
			if msg.Method != "update" && msg.Method != "keepAlive" {
				log.Println(msg)
			}

			if msg.Method == "join" {
				c.nickname = msg.Nickname
				c.party.join <- c
			} else if msg.Method == "play" {
				c.party.broadcast <- message
				c.party.party.IsPlaying = true
			} else if msg.Method == "pause" {
				c.party.broadcast <- message
				c.party.party.IsPlaying = false
			} else if msg.Method == "seeked" {
				c.party.party.Playhead = msg.Playhead
				c.party.broadcast <- message
			} else if msg.Method == "update" {
				c.party.party.Playhead = msg.Playhead
			} else if msg.Method == "chat" {
				broadcastChatMessage(msg, c)
			}
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				log.Printf("Error creating next writer %v\n", err)
				return
			}
			w.Write(message)

			if err := w.Close(); err != nil {
				log.Printf("Error closing writer %v\n", err)
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				log.Printf("Error sending ping message %v\n", err)
				return
			}
		}
	}
}
