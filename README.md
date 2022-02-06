# Aliucord iOS

This repo contains all the projects and files related to Aliucord iOS.  
Currently tested build: **114.0 (30255)**.  

## 1. Set up

All the files required to use Aliucord iOS are provided in `files/` directory.  

Source for `hermes` can be found [here](https://github.com/Aliucord/hermes/tree/aliucord-ios), built using `utils/build-ios-framework.sh`.  
Source for `Aliucord.dylib` can be found [here](tweak), requires theos to be built.  

`Discord.ipa` comes from the App Store, although it is decrypted using bfdecrypt so we can change files and sideload without any issues.  
`icons.zip` is just a bunch of icons that will be injected into the Discord app.  

## 2. Preparing the IPA  

To patch the Discord IPA, you can use the script provided by `patcher/`, pre-compilled binaries can be found in the `build/` folder.  

```shell
./build/patcher_<os> -d ../files/Discord.ipa -i ../files/icons.zip -h ../files/hermes
```

or you can run it from sources (with Go installed):

```shell
go run cmds/patcher/main.go -d ../files/Discord.ipa -i ../files/icons.zip -h ../files/hermes
```

If everything goes well, it should output a file named `Aliucord.ipa` ready to be installed on your device!

## 3. Installing the IPA (Windows and macOS)

To install the IPA, connect your device to your PC and open up [`Sideloadly`](https://sideloadly.io/).  
Select the previously created `Aliucord.ipa` as the source file and then click `Advanced options`.  
Enable `Inject dylibs/frameworks` and drag and drop `Aliucord.dylib` from above in the box so it injects the tweak into the app itself.  
Make sure `Cydia Substrate` is also ticked.  

## 3. Installing the IPA (Linux)

I have yet to find a way to easily inject the tweak into Discord's binary under Linux, this guide will be updated once a method has been found and tested.  

## 4. Testing Aliucord

If everything went well, you should be able to launch the freshly installed Discord app on your phone and log into your account.  
To verify that Aliucord is installed properly and that the loader script has been downloaded, go into any chat and type `/plugins`, if the command shows up, `Aliucord` is properly installed.  

## 5. Making plugins

Plugins are pretty simple to make and should be familiar to you if you've made plugins for desktop before.  
Plugins are written primarly in Typescript and compilled into a single JS file.  
You can take a look at [Aliucord-Plugins](https://github.com/NotZoeyDev/Aliucord-Plugins) as a starting point, it includes some plugins I've created and also has my template plugin project.

## 6. Debugging

To easily debug a plugin, you can use the `Console` app bundled with macOS to see everything logged by Discord including Javsacript code.  
To get started, open up the app and select the device you want to debug from.  
Then, make sure that `View Info Messages` is enabled under the action menu.  
Lastly, type in `Discord` in the search bar and mark it as Process, and then enter `Javascript` and mark it as Category.  
With that enabled, you'll see everything outputted by the Javascript context in the Discord app, including `console.log`.

## Notice

I always test with the latest testflight build available so I can always offer the most up-to-date experience, I'd recommend checking this repo daily to see if a new build has come out.  The Aliucord loader file will be updated when a new build is published and might be incompatible with your current installed version of Discord.
