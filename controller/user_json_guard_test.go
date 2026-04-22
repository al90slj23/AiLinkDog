package controller_test

import (
	"os"
	"strings"
	"testing"
)

func TestUserControllerUsesCommonJSONWrappers(t *testing.T) {
	content, err := os.ReadFile("user.go")
	if err != nil {
		t.Fatalf("failed to read user controller source: %v", err)
	}

	source := string(content)
	if strings.Contains(source, "\"encoding/json\"") {
		t.Fatal("user controller should not import encoding/json")
	}
	if strings.Contains(source, "json.NewDecoder") || strings.Contains(source, "json.Marshal") || strings.Contains(source, "json.Unmarshal") {
		t.Fatal("user controller should use common JSON wrappers")
	}
	for _, expected := range []string{"common.DecodeJson", "common.Marshal", "common.Unmarshal"} {
		if !strings.Contains(source, expected) {
			t.Fatalf("user controller should use %s", expected)
		}
	}
}
