package main

import (
	"testing"
	"time"
)

func TestRun(t *testing.T) {
	party := createParty("party-123", "user-123", "https://youtube.com")

	go party.run()

	time.Sleep(8 * time.Second)
	// call create party
	// party.run
	// wait for end message
}
