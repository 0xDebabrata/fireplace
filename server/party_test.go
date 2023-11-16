package main

import (
	"fmt"
	"testing"
)

func TestRun() {
	party := createParty("party-123", "user-123", "https://youtube.com")

    go party.run()
	// call create party
	// party.run
	// wait for end message
}