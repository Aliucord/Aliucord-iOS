package patcher

import (
	"errors"
	"io"
	"log"
	"os"

	"howett.net/plist"
)

const (
	DEFAULT_IPA_PATH      = "files/Discord.ipa"
	DEFAULT_HERMES_PATH   = "files/hermes"
	DEFAULT_ICONS_PATH    = "files/icons.zip"
	DEFAULT_ALIUCORD_PATH = "files/Aliucord.dylib"
)

const (
	IPA_URL      = "https://ios.aliucord.com/files/Discord.ipa"
	HERMES_URL   = "https://ios.aliucord.com/files/hermes"
	ALIUCORD_URL = "https://ios.aliucord.com/files/Aliucord.dylib"
	ICONS_URL    = "https://ios.aliucord.com/files/icons.zip"
)

func PatchDiscord(discordPath *string, hermesPath *string, iconsPath *string, dylibPath *string) {
	log.Println("starting patcher")

	checkFile(discordPath, DEFAULT_IPA_PATH, IPA_URL)
	checkFile(hermesPath, DEFAULT_HERMES_PATH, HERMES_URL)
	checkFile(iconsPath, DEFAULT_ICONS_PATH, ICONS_URL)
	checkFile(dylibPath, DEFAULT_ALIUCORD_PATH, ALIUCORD_URL)

	extractDiscord(discordPath)

	log.Println("patching hermes")
	if err := patchHermes(hermesPath); err != nil {
		log.Fatalln(err)
	}
	log.Println("hermes patched")

	log.Println("renaming Discord to Aliucord")
	if err := patchName(); err != nil {
		log.Fatalln(err)
	}
	log.Println("Discord renamed")

	log.Println("adding Aliucord url scheme")
	if err := patchSchemes(); err != nil {
		log.Fatalln(err)
	}
	log.Println("url scheme added")

	log.Println("remove devices whitelist")
	if err := patchDevices(); err != nil {
		log.Fatalln(err)
	}
	log.Println("device whitelist removed")

	log.Println("patch Discord icons")
	extractIcons(iconsPath)
	if err := patchIcon(); err != nil {
		log.Fatalln(err)
	}
	log.Println("icons patched")

	packDiscord()
	log.Println("cleaning up")
	clearPayload()

	log.Println("done!")
}

// Check if file exists, download if not found
func checkFile(path *string, defaultPath string, url string) {
	_, err := os.Stat(*path)
	if errors.Is(err, os.ErrNotExist) {
		if *path == defaultPath {
			log.Println("downloading", url, "to", *path)
			err := downloadFile(url, path)
			if err != nil {
				log.Println("error downloading", url)
				log.Fatalln(err)
			}
		} else {
			log.Fatalln("file not found", *path)
		}
	}
}

// Delete the payload folder
func clearPayload() {
	err := os.RemoveAll("Payload")
	if err != nil {
		log.Panicln(err)
	}
}

// Load Discord's plist file
func loadPlist() (map[string]interface{}, error) {
	infoFile, err := os.Open("Payload/Discord.app/Info.plist")
	if err != nil {
		return nil, err
	}

	var info map[string]interface{}
	decoder := plist.NewDecoder(infoFile)
	if err := decoder.Decode(&info); err != nil {
		return nil, err
	}

	return info, nil
}

// Save Discord's plist file
func savePlist(info *map[string]interface{}) error {
	infoFile, err := os.OpenFile("Payload/Discord.app/Info.plist", os.O_RDWR|os.O_TRUNC, 0600)
	if err != nil {
		return err
	}

	encoder := plist.NewEncoder(infoFile)
	err = encoder.Encode(*info)
	return err
}

// Patch Discord's hermes build
func patchHermes(hermesPath *string) error {
	patchedHermes, err := os.Open(*hermesPath)
	if err != nil {
		return err
	}

	outHermes, err := os.OpenFile("Payload/Discord.app/Frameworks/hermes.framework/hermes", os.O_RDWR, 0600)
	if err != nil {
		return err
	}

	_, err = io.Copy(outHermes, patchedHermes)
	return err
}

// Patch Discord's name
func patchName() error {
	info, err := loadPlist()
	if err != nil {
		return err
	}

	info["CFBundleName"] = "Aliucord"
	info["CFBundleDisplayName"] = "Aliucord"

	err = savePlist(&info)
	return err
}

// Patch Discord's URL scheme to add Aliucord's URL handler
func patchSchemes() error {
	info, err := loadPlist()
	if err != nil {
		return err
	}

	info["CFBundleURLTypes"] = append(
		info["CFBundleURLTypes"].([]interface{}),
		map[string]interface{}{
			"CFBundleURLName": "Aliucord",
			"CFBundleURLSchemes": []string{
				"aliucord",
			},
		},
	)

	err = savePlist(&info)
	return err
}

// Remove Discord's device limits
func patchDevices() error {
	info, err := loadPlist()
	if err != nil {
		return err
	}

	delete(info, "UISupportedDevices")

	err = savePlist(&info)
	return err
}

// Patch the Discord icon to use Aliucord's icon
func patchIcon() error {
	info, err := loadPlist()
	if err != nil {
		return err
	}

	info["CFBundleIcons"].(map[string]interface{})["CFBundlePrimaryIcon"].(map[string]interface{})["CFBundleIconName"] = "AliuIcon"
	info["CFBundleIcons"].(map[string]interface{})["CFBundlePrimaryIcon"].(map[string]interface{})["CFBundleIconFiles"] = []string{"AliuIcon60x60"}

	info["CFBundleIcons~ipad"].(map[string]interface{})["CFBundlePrimaryIcon"].(map[string]interface{})["CFBundleIconName"] = "AliuIcon"
	info["CFBundleIcons~ipad"].(map[string]interface{})["CFBundlePrimaryIcon"].(map[string]interface{})["CFBundleIconFiles"] = []string{"AliuIcon60x60", "AliuIcon76x76"}

	err = savePlist(&info)
	return err
}
