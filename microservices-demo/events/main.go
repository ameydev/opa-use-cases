package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
)

func homeLink(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome home!")
}

type event struct {
	ID          int
	Title       string `json:"Title"`
	Description string `json:"Description"`
	Presentor   string `json:"Presentor"`
}

type EventsData struct {
	Events allEvents
}
type opaResponse struct {
	DecisionID string `json:"decision_id"`
	Result     bool   `json: opaResult`
}

type inputJSONData struct {
	Method   string   `json:"method"`
	API      string   `json:"api"`
	Metadata Metadata `json:"metadata"`
}

type opaRequest struct {
	Input inputJSONData `json:"input"`
}

type Metadata struct {
	User    string `json:"user"`
	EventID int    `json:"eventID"`
	Role    string `json:"role"`
}

var eventsDataJSON string = "../policies/data/events.json"

type allEvents []event

var events = allEvents{
	{
		ID:          1,
		Title:       "Introduction to OPA",
		Description: "Come join us for a chance to learn how OPA works and get to eventually try it out",
		Presentor:   "Amey",
	},
}

func getOneEvent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	eventID := mux.Vars(r)["id"]
	id, err := strconv.Atoi(eventID)
	if err == nil {
		fmt.Printf("i=%d, type: %T\n", id, id)
	}
	log.Printf("%s %s %s %s %s\n", r.RemoteAddr, r.Method, r.URL, id, r.Body)
	events = fetchEvents()
	for _, singleEvent := range events {
		if singleEvent.ID == id {
			json.NewEncoder(w).Encode(singleEvent)
		}
	}
}

func fetchEvents() allEvents {
	jsonFile, err := os.Open(eventsDataJSON)
	if err != nil {
		fmt.Println(err)
	}
	byteValue, _ := ioutil.ReadAll(jsonFile)
	var test EventsData
	json.Unmarshal([]byte(byteValue), &test)

	jsonFile.Close()
	return test.Events
}

func getAllEvents(w http.ResponseWriter, r *http.Request) {
	// enableCors(&w)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if (*r).Method == "OPTIONS" {
		return
	}
	if isAuthorized(r) == 401 {
		w.WriteHeader(http.StatusUnauthorized)
	} else {

		log.Printf("%s %s %s\n", r.RemoteAddr, r.Method, r.URL)
		json.NewEncoder(w).Encode(fetchEvents())
	}
}

func updateEvent(w http.ResponseWriter, r *http.Request) {
	// enableCors(&w)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if (*r).Method == "OPTIONS" {
		return
	}

	reqBody, err := ioutil.ReadAll(r.Body)
	var updatedEvent event

	if err != nil {
		fmt.Fprintf(w, "Kindly enter data with the event title and description only in order to update")
	}
	json.Unmarshal(reqBody, &updatedEvent)
	// var eventID, _ = strconv.Atoi(r.Header.Get("EventID"))
	eventID := mux.Vars(r)["id"]
	id, _ := strconv.Atoi(eventID)
	updatedEvent.ID = id
	// id, err := strconv.Atoi(eventID)
	if err != nil {
		fmt.Printf("i=%d, type: %T\n", eventID, eventID)
	}
	if isAuthorized(r) == 401 {
		w.WriteHeader(http.StatusUnauthorized)
	} else {
		events := fetchEvents()
		for i, singleEvent := range events {
			if singleEvent.ID == id {
				singleEvent.Title = updatedEvent.Title
				singleEvent.Description = updatedEvent.Description
				events = append(events[:i], singleEvent)
				json.NewEncoder(w).Encode(http.StatusOK)
			} else {
				events = append(events, singleEvent)
			}
		}
		refreshData(events)
	}
}

func getNewID() int {
	log.Println("A new event id added ", len(events)+1)
	return len(fetchEvents()) + 1
}

func refreshData(events allEvents) {
	eventsData := EventsData{
		Events: events,
	}
	data, _ := json.Marshal(eventsData)
	err := ioutil.WriteFile(eventsDataJSON, data, 0644)
	if err != nil {
		fmt.Printf("Error in wrinting events data\n")
	}
}

func createEvent(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if (*r).Method == "OPTIONS" {
		return
	}
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Kindly enter data with the event title and description only in order to update")
		w.WriteHeader(http.StatusBadRequest)
	}
	if isAuthorized(r) == 401 {
		w.WriteHeader(http.StatusUnauthorized)
	} else {
		events := fetchEvents()
		var newEvent event
		json.Unmarshal(reqBody, &newEvent)
		newEvent.ID = getNewID()
		events = append(events, newEvent)
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(newEvent)
		refreshData(events)

	}
}

func deleteEvent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if (*r).Method == "OPTIONS" {
		return
	}
	if isAuthorized(r) == 401 {
		w.WriteHeader(http.StatusUnauthorized)
	} else {
		events := fetchEvents()
		eventID := mux.Vars(r)["id"]
		id, err := strconv.Atoi(eventID)
		if err == nil {
			fmt.Printf("i=%d, type: %T\n", id, id)
		}
		log.Printf("%s %s %s %s\n", r.RemoteAddr, r.Method, r.URL, eventID)
		for i, singleEvent := range events {
			if singleEvent.ID == id {
				events = append(events[:i], events[i+1:]...)
				fmt.Fprintf(w, "The event with ID %v has been deleted successfully", eventID)
			}
		}
		refreshData(events)
	}
}

func isAuthorized(r *http.Request) int {

	var role = r.Header.Get("Role")
	var user = r.Header.Get("User")
	// var eventID, _ = strconv.Atoi(r.Header.Get("EventID"))
	var apiEndPoint = r.URL.Path
	var reqMethod = r.Method

	reqMetadata := &Metadata{User: user, Role: role}
	varInputJSONData := &inputJSONData{API: apiEndPoint, Method: reqMethod, Metadata: *reqMetadata}
	varOpaRequest := &opaRequest{Input: *varInputJSONData}
	jsonValue, _ := json.Marshal(varOpaRequest)
	fmt.Println(string(jsonValue))
	response, err := http.Post("http://localhost:8181/v1/data/events/allow", "application/json", bytes.NewBuffer(jsonValue))
	if err != nil {
		fmt.Printf("OPA request failed with error %s\n", err)
		return 500

	} else {
		data, _ := ioutil.ReadAll(response.Body)
		fmt.Println(string(data))
		if string(data) == "{}" {
			log.Printf("No response from OPA. Returning 200")
			return 200
		}

		var res = new(opaResponse)
		err = json.Unmarshal(data, &res)
		if err != nil {
			fmt.Println("Error unmarshalling OPA response")
			log.Printf("%s", err)
		}
		if !res.Result {
			log.Printf("%s %T", res, res)
			log.Printf("Returning ", 401)
			return 401
		} else {
			log.Printf("Returning ", 200)
			return 200
		}
	}
}

func main() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/events", createEvent).Methods("POST")
	router.HandleFunc("/events", getAllEvents).Methods("GET")
	router.HandleFunc("/events/{id}", getOneEvent).Methods("GET")
	router.HandleFunc("/events/{id}", updateEvent).Methods("PUT")
	router.HandleFunc("/events/{id}", deleteEvent).Methods("DELETE", "OPTIONS")
	log.Fatal(http.ListenAndServe(":8080", router))
}
