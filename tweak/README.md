# Aliucord-iOS tweak

A [theos](https://github.com/theos/theos)-based tweak for Discord, used mainly to fetch `Aliucord.js` over the network and manage files on the device.  
This is somewhat required for a few reasons, first of all, iOS cannot fetch from the Users's documents without users being prompted for it.  
Since we cannot use documents, we store the data into the app's data which Discord can access, including this tweak since it runs in Discord's context.  
It's also used for plugins management.  

NOTE: This tweak doesn't require a jailbroken device and I'd highly suggest that you never install this as a tweak directly, this is meant to be injected into Discord with some other customization applied to the app.  
