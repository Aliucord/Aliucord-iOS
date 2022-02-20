package main

import (
	"flag"

	"panties.moe/aliucord_patcher/internal/patcher"
)

var (
	ipaFile    string
	hermesFile string
	iconsFile  string
	dylibFile  string
)

func init() {
	flag.StringVar(&ipaFile, "d", patcher.DEFAULT_IPA_PATH, "Path for Discord.ipa")
	flag.StringVar(&hermesFile, "h", patcher.DEFAULT_HERMES_PATH, "Path for hermes")
	flag.StringVar(&iconsFile, "i", patcher.DEFAULT_ICONS_PATH, "Path for icons.zip")
	flag.StringVar(&dylibFile, "a", patcher.DEFAULT_ALIUCORD_PATH, "Path for Aliucord.dylib")

	flag.Parse()
}

func main() {
	patcher.PatchDiscord(&ipaFile, &hermesFile, &iconsFile, &dylibFile)
}
