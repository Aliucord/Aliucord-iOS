#import "Commands.h"
#import "Plugins.h"
#import "Utils.h"
#import "Theme.h"

#define ALIUCORD_PATH [NSString stringWithFormat:@"%@/%@", NSHomeDirectory(), @"Documents/Aliucord.js"]

// Define the URL used to download Aliucord, also disable logs in release mode
#ifdef DEBUG
#		define ALIUCORD_URL @"http://127.0.0.1:8080/Aliucord.js"
#   define IS_DEBUG true
#		define NSLog(fmt, ... ) NSLog((@"[Aliucord-iOS] " fmt), ##__VA_ARGS__);
#else 
#		define ALIUCORD_URL @"https://plugins.panties.moe/Aliucord.js"
#   define IS_DEBUG false
#		define NSLog(...) (void)0
#endif