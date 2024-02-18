package main_test

import (
	"strings"
	"testing"
)

// learning test
func SplitTest(t *testing.T) {
	data := "hello\n\nworld"
	got := strings.Split(data, "\n")
	if len(got) != 3 {
		t.Errorf("Expected 3, got %d", len(got))
	}
	if got[0] != "hello" {
		t.Errorf("Expected hello, got %s", got[0])
	}
	if got[1] != "" {
		t.Errorf("Expected empty string, got %s", got[1])
	}
	if got[2] != "world" {
		t.Errorf("Expected world, got %s", got[2])
	}
}
