package main

import (
	"flag"

	"panties.moe/aliucord_patcher/internal/patcher"
)

var (
	ipaFile    string
	hermesFile string
	iconsFile  string
)

func init() {
	flag.StringVar(&ipaFile, "d", "discord.ipa", "Path for the Discord IPA to patch")
	flag.StringVar(&hermesFile, "h", "hermes", "Path for the patched hermes")
	flag.StringVar(&iconsFile, "i", "icons.zip", "Path for the patched icons")

	flag.Parse()
}

func main() {
	patcher.PatchDiscord(&ipaFile, &hermesFile, &iconsFile)
}
