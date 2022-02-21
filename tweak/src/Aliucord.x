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
		}
	}

	return original;
}

- (void)startWithLaunchOptions:(id)options {
	%orig;
}

%end

%hook RCTCxxBridge 

- (void)executeApplicationScript:(NSData *)script url:(NSURL *)url async:(BOOL)async {
	if ([[url absoluteString] isEqualToString:@"tweak"]) {
		%orig;
		return;
	}

	// Apply modules patch
	NSString *modulesPatchCode = @"const oldObjectCreate = this.Object.create;"\
																"const _window = this;"\
																"_window.Object.create = (...args) => {"\
																"    const obj = oldObjectCreate.apply(_window.Object, args);"\
																"    if (args[0] === null) {"\
																"        _window.modules = obj;"\
																"        _window.Object.create = oldObjectCreate;"\
																"    }"\
																"    return obj;"\
																"};";

	NSData* modulesPatch = [modulesPatchCode dataUsingEncoding:NSUTF8StringEncoding];
	NSLog(@"Injecting modules patch");
	%orig(modulesPatch, [NSURL URLWithString:@"preload"], false);

	// Load bundle
	NSLog(@"Injecting bundle");
	%orig(script, url, false);

	if (!checkFileExists(ALIUCORD_PATH)) {
		alert(@"Aliucord.js couldn't be found, please try restarting Discord.");
		return;
	}

	// Debug code
	%orig([[NSString stringWithFormat:@"window.aliucord_debug = %s", IS_DEBUG ? "true" : "false"] dataUsingEncoding:NSUTF8StringEncoding], [NSURL URLWithString:@"preload"], false);
	%orig([@"window.plugins = {}; window.plugins.enabled = []; window.plugins.disabled = [];" dataUsingEncoding:NSUTF8StringEncoding], [NSURL URLWithString:@"plugins"], false);

	// Inject Aliucord script
	NSError* error = nil;
	NSData* aliucord = [NSData dataWithContentsOfFile:ALIUCORD_PATH options:0 error:&error];
	if (error) {
		NSLog(@"Couldn't load Aliucord.js");
		return;
	}

	NSString *aliucordCode = [[NSString alloc] initWithData:aliucord encoding:NSUTF8StringEncoding];
	aliucordCode = wrapPlugin(aliucordCode, 9000, @"Aliucord.js");
	
	NSLog(@"Injecting Aliucord");
	%orig([aliucordCode dataUsingEncoding:NSUTF8StringEncoding], [NSURL URLWithString:@"aliucord"], false);

	// Load plugins
	NSString* pluginsList = getPlugins();
	NSArray *plugins = [pluginsList componentsSeparatedByString:@","];
	int pluginID = 9001;
	for (NSString *plugin in plugins) {
		NSString *pluginPath = getPluginPath(plugin);
		
		%orig([[NSString stringWithFormat:@"window.plugins.%s.push('%@')", isEnabled(pluginPath) ? "enabled" : "disabled", getPluginName([NSURL URLWithString:plugin])] dataUsingEncoding:NSUTF8StringEncoding], [NSURL URLWithString:@"plugins"], false);

		NSError* error = nil;
		NSData* pluginData = [NSData dataWithContentsOfFile:pluginPath options:0 error:&error];
		if (error) {
			NSLog(@"Couldn't load %@", plugin);
			continue;
		}

		NSString *pluginCode = [[NSString alloc] initWithData:pluginData encoding:NSUTF8StringEncoding];

		NSLog(@"Injecting %@", plugin);
		%orig([wrapPlugin(pluginCode, pluginID, plugin) dataUsingEncoding:NSUTF8StringEncoding], [NSURL URLWithString:plugin], false);
		pluginID += 1;
	}
}

%end