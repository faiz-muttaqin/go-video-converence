package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func Welcome(c *fiber.Ctx) error {
	fmt.Println()
	return c.Render("welcome", nil, "layouts/main")
}
