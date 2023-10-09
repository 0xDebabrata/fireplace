package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

type watchparty struct {
    id string
    ownerId string
    src string
}

var upgrader = websocket.Upgrader{
    ReadBufferSize: 1024,
    WriteBufferSize: 1024,
}

//var watchparties = make(map[string] *Party)
var watchparties = sync.Map{}

func hello(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    fmt.Fprintf(w, "hello\n")
}

func handleCreateWatchparty(w http.ResponseWriter, r *http.Request) {
    requestQuery := r.URL.Query()
    ownerId := requestQuery.Get("ownerId")
    partyId := requestQuery.Get("partyId")
    src := requestQuery.Get("src")

    if ownerId == "" {
        log.Println("Owner ID not provided")
        http.Error(w, "Owner ID not provided", http.StatusForbidden)
        return
    }
    if partyId == "" || src == "" {
        log.Println("Party ID or video source not provided")
        http.Error(w, "Incomplete watchparty details provided\n", http.StatusNotFound)
        return
    }

    party := createParty(partyId, ownerId, src)
    watchparties.Store(partyId, party)
    go party.run()

    fmt.Fprint(w, "Success")
}

func websocketHandler(w http.ResponseWriter, r *http.Request) {
    requestQuery := r.URL.Query()
    userId := requestQuery.Get("userId")
    partyId := requestQuery.Get("partyId")

    if userId == "" || partyId == "" {
        log.Println("User ID or Party ID not provided")
        return
    }

    upgrader.CheckOrigin = func(r *http.Request) bool {
        return true
    }
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
        return
    }

    if userId != "" {
        party, ok := watchparties.Load(partyId)
        if ok {
            client := initClient(userId, conn, party.(*Party))  // Go type assertion
            go client.readPump()
            go client.writePump()
        } else {
            conn.Close()
        }
    }
}

func main() {
    mux := http.NewServeMux()

    mux.HandleFunc("/create", handleCreateWatchparty)
    mux.HandleFunc("/ws", websocketHandler)
    mux.HandleFunc("/", hello)

    handler := cors.Default().Handler(mux)
    http.ListenAndServe(":6969", handler)
}
