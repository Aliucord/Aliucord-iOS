#import "Aliucord.h"
#import "Utils.h"
#import "Plugins.h"

@interface AppDelegate
    @property (nonatomic, strong) UIWindow *window;
@end

%hook AppDelegate

- (id)sourceURLForBridge:(id)arg1 {
	id original = %orig;

	if (checkForUpdate()) {
		NSLog(@"Downloading Aliucord.js to %@", ALIUCORD_PATH);
		BOOL success = downloadFile(ALIUCORD_URL, ALIUCORD_PATH);
		
		if (success) {
			NSLog(@"Downloaded");
		} else {
			NSLog(@"Error downloading");

			if (!checkFileExists(ALIUCORD_PATH)) {
				alert(@"Epic fail");
			}
		}
	}

	return original;
}

- (void)startWithLaunchOptions:(id)options {
	%orig;
	injectCode(self.window, [NSString stringWithFormat:@"aliucord.debug = %s", IS_DEBUG ? "true" : "false"]);
	if (IS_DEBUG) {
		injectCode(self.window, @"aliucord.__ALIUCORD_INTERNAL_IF_YOU_USE_THIS_I_WILL_NUKE_YOU__.connectWebsocket('localhost:9090')");
	}
}

%end