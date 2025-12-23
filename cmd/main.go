package main

import (
	"log"

	"v/internal/app_installer"
	"v/internal/server"

	"github.com/joho/godotenv"
)

func main() {
	app_installer.Init()
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	if err := server.Run(); err != nil {
		log.Fatalln(err.Error())
	}
}
