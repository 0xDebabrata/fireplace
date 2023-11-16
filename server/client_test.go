package main

import (
	// "fmt"
	"log"
	"testing"
	"time"
	"net/http"
	// "net/url"
	"github.com/gorilla/websocket"
)

func TestClient(t *testing.T) {
	log.Println("Test started.")
	go main()
	time.Sleep(1 * time.Second)
	log.Println("Woke up, creating client now")
	createClient()
	time.Sleep(35*time.Second)
}

func createClient() {
	url := "http://localhost:6969/create?ownerId=user-123&partyId=party-123&src=https://example.com"

	// create watchparty
	resp, err := http.Get(url)
	log.Println("HTTP Response", resp.Body)
	if err != nil {
		log.Println("error making request", err)
	}

	// join as client
	go wsClient()
}

func wsClient() {
	wsUrl := "ws://localhost:6969/ws?userId=user-234&partyId=party-123"

	log.Println("Connecting to", wsUrl)
	c, _, err := websocket.DefaultDialer.Dial(wsUrl, nil)
	if err != nil {
		log.Fatal("dial:", err)
	}
	defer c.Close()

	go func() {
		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				return
			}
			log.Printf("recv: %s", message)
		}
	}()

	// Close WS connection after 4s
	time.Sleep(2 * time.Second)
	log.Println("Client closing connection.")
	err = c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
	if err != nil {
		log.Println("write close:", err)
		return
	}
			
	// ticker := time.NewTicker(time.Second)
	// defer ticker.Stop()

	// for {
	// 	select {
	// 	case t := <-ticker.C:
	// 		err := c.WriteMessage(websocket.TextMessage, []byte(t.String()))
	// 		if err != nil {
	// 			log.Println("write:", err)
	// 			return
	// 		}
	// 	}
	// }
}