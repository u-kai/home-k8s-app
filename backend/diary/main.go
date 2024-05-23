package main

import (
	"context"
	"ele/common"
	wordbook "ele/wordbook/pkg"
)

func main() {
	logger := common.NewJsonLogger()
	ctx := context.Background()
	server := common.DefaultELEServer("wordbook")
	server.RegisterHandler("/words", wordbook.FetchWordProfileHandler(ctx))
	server.RegisterHandler("/deleteWord", wordbook.DeleteWordHandler(ctx))
	server.RegisterHandler("/registerWord", wordbook.RegisterWordHandler(ctx))
	server.RegisterHandler("/updateWord", wordbook.UpdateWordHandler(ctx))
	logger.Info("Starting Wordbook server...")
	server.Start()
}
