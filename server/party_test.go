package main

import (
	"testing"
)

func TestRun(t *testing.T) {
	party := createParty("party-123", "user-123", "https://youtube.com")

	go party.run()
	// call create party
	// party.run
	// wait for end message
}
