package main

import(
"fmt"
"log"
"net/http"
"encoding/json"
"context"
"time"    
"go.mongodb.org/mongo-driver/bson"
"go.mongodb.org/mongo-driver/mongo"
"go.mongodb.org/mongo-driver/mongo/options"
)


type UserData struct {
    EmailId string `json:"emailId"`
    IsActive int `json:"isActive"`
    Status string `json:"status"`
}

type PassData struct {
    EmailId string `json:"emailId"`
    Password string `json:"password"`
}

type UpdateResponse struct {
    EmailId string `json:"emailId"`
    Status string `json:"status"`
    Message string `json:"message"`
}


var UserDatas []UserData
var UpdateResponses []UpdateResponse

func homepage(w http.ResponseWriter, r *http.Request){
fmt.Fprintf(w,"404 Page not Found")
fmt.Println("page ended")
}

func handleRequest() {
http.HandleFunc("/",homepage)
http.HandleFunc("/getDetails", getDetails)
http.HandleFunc("/updateRecords", updateRecords)
log.Fatal(http.ListenAndServe(":80",nil))
}

func updateRecords(w http.ResponseWriter, r *http.Request){
    decoder := json.NewDecoder(r.Body)
if decoder != nil{
var data PassData
err := decoder.Decode(&data)
if err != nil {
UpdateResponses = []UpdateResponse{
       UpdateResponse{Status : "Failure",Message : "Unable to change password"},
   }
}else{
fmt.Println(data.EmailId)
fmt.Println(data.Password)
   updateData(data.EmailId,data.Password)
}
}else{
UpdateResponses = []UpdateResponse{
       UpdateResponse{Status : "Failure",Message : "Unable to change password"},
   }
}
json.NewEncoder(w).Encode(UpdateResponses)
}


func updateData(emailId string,newPass string){
client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://adminUser:mYstr0ngPa$$word@127.0.0.1:27017/?authSource=admin"))

    if err != nil {
        log.Fatal(err)
    }

    ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
    err = client.Connect(ctx)

    if err != nil {
        log.Fatal(err)
    }
   
    defer client.Disconnect(ctx)

    quickstartDatabase := client.Database("test")
    userprofile := quickstartDatabase.Collection("userprofile")

    filter := bson.M{"emailId": bson.M{"$eq": emailId}}

    update := bson.M{"$set": bson.M{"password": newPass}}

    result, err := userprofile.UpdateOne(
        context.Background(),
        filter,
        update,
    )

    fmt.Println(result)
    if err != nil {
        fmt.Println("UpdateOne() result ERROR:", err)
    } else {
    UpdateResponses = []UpdateResponse{
   UpdateResponse{Status : "Success",Message : "Password Changed Successfully",EmailId : emailId},
}
    }

}

func getDetails(w http.ResponseWriter, r *http.Request){
    decoder := json.NewDecoder(r.Body)
if decoder != nil{
var data UserData
err := decoder.Decode(&data)
if err != nil {
UserDatas = []UserData{
       UserData{Status : "Failure"},
   }
}else{
fmt.Println(data.EmailId)
   getData(data.EmailId)
}
}else{
UserDatas = []UserData{
   UserData{Status : "Failure"},
}
}
json.NewEncoder(w).Encode(UserDatas)
}

func getData(emailId string){
client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://adminUser:mYstr0ngPa$$word@127.0.0.1:27017/?authSource=admin"))

    if err != nil {
        log.Fatal(err)
    }

    ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
    err = client.Connect(ctx)

    if err != nil {
        log.Fatal(err)
    }
   
    defer client.Disconnect(ctx)

    quickstartDatabase := client.Database("test")
    userprofile := quickstartDatabase.Collection("userprofile")


    var podcast UserData
    if err = userprofile.FindOne(ctx, bson.M{"emailId": emailId }).Decode(&podcast); err != nil {
UserDatas = []UserData{
       UserData{Status : "Failure"},
   }
    }else{
   UserDatas = []UserData{
       UserData{EmailId : podcast.EmailId, IsActive : podcast.IsActive, Status : "Success"},
   }
    }
}

func main() {
handleRequest()
}