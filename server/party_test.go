package main

import (
	"testing"
	"time"
	"net/http"
	"log"
)

func TestRun(t *testing.T) {
	party := createParty("party-123", "user-123", "https://youtube.com")
	go party.run()
	time.Sleep(8 * time.Second)
}

func TestWatchpartyRemoval(t *testing.T) {
	go main()
	url := "http://localhost:6969/create?ownerId=user-123&partyId=party-123&src=https://example.com"

	// create watchparty
	resp, err := http.Get(url)
	log.Println("HTTP Response", resp.Body)
	if err != nil {
		log.Println("error making request", err)
	}

	time.Sleep(8 * time.Second)
}