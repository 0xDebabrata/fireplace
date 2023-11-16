package main

import (
	// "fmt"
	"log"
	"os"
	"os/signal"
	"testing"
	"time"
	"net/http"
	// "net/url"
	"github.com/gorilla/websocket"
)

func TestClient(t *testing.T) {
	go main()
	time.Sleep(1 * time.Second)
	createClient()
	time.Sleep(12*time.Second)
}

func createClient() {
	url := "http://localhost:6969/create?ownerId=user-123&partyId=party-123&src=https://example.com"

	// create watchparty
	resp, err := http.Get(url)
	log.Println(resp.Body)
	if err != nil {
		log.Println("error making request", err)
	}

	// join as client
	wsClient()
}

func wsClient() {
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)
	wsUrl := "ws://localhost:6969/ws?userId=user-234&partyId=party-123"

	log.Println("Connecting to", wsUrl)
	c, _, err := websocket.DefaultDialer.Dial(wsUrl, nil)
	if err != nil {
		log.Fatal("dial:", err)
	}
	defer c.Close()

	done := make(chan struct{})

	go func() {
		defer close(done)
		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				return
			}
			log.Printf("recv: %s", message)
		}
	}()

	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-done:
			return
		case t := <-ticker.C:
			err := c.WriteMessage(websocket.TextMessage, []byte(t.String()))
			if err != nil {
				log.Println("write:", err)
				return
			}
		case <-interrupt:
			log.Println("interrupt")

			// Cleanly close the connection by sending a close message and then
			// waiting (with timeout) for the server to close the connection.
			err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
			if err != nil {
				log.Println("write close:", err)
				return
			}
			select {
			case <-done:
			case <-time.After(time.Second):
			}
			return
		}
	}
}