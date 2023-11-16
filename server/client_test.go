package main

import (
	"fmt"
	"testing"
	"time"
)

func TestClient(t *testing.T) {
	go main()
	time.Sleep(10*time.Second)
}