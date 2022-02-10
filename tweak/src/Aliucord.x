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
}

%end