#import "Utils.h"

#define ALIUCORD_PATH [NSString stringWithFormat:@"%@/%@", NSHomeDirectory(), @"Documents/Aliucord.js"]
#define ALIUCORD_PROTOCOL @"aliucord://"

#ifndef DEBUG
#undef NSLog
#define NSLog(args, ...)
#endif

#ifdef DEBUG
#define ALIUCORD_URL @"http://127.0.0.1:8080/Aliucord.js"
#else
#define ALIUCORD_URL @"https://plugins.panties.moe/Aliucord.js"
#endif

// Download Aliucord.js
void downloadLoader() {
	NSString *stringURL = ALIUCORD_URL;
	NSURL *url = [NSURL URLWithString:stringURL];

	NSData *urlData = [NSData dataWithContentsOfURL:url];

	if (urlData) {
		[urlData writeToFile:ALIUCORD_PATH atomically:YES];
	}
}

%hook AppDelegate

- (id)sourceURLForBridge:(id)arg1 {
	id original = %orig;

	NSLog(@"[Aliucord-iOS] Downloading Aliucord.js to %@", ALIUCORD_PATH);
	downloadLoader();
	NSLog(@"[Aliucord-iOS] Downloaded");

	return original;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options {
	%orig;

	NSString *commandString = url.absoluteString;

	// Validate URL scheme
	if ([commandString rangeOfString:ALIUCORD_PROTOCOL].location == NSNotFound) {
		NSLog(@"[Aliucord-iOS] Invalid protocol");
		return true;
	}

	// Clean the command string
	NSString *commandJson = [[commandString stringByReplacingOccurrencesOfString:ALIUCORD_PROTOCOL withString:@""] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
	NSLog(@"[Aliucord-iOS] commandJson: %@", commandJson);

	// Parse the command
	NSError *error;
  id json = [NSJSONSerialization JSONObjectWithData:[commandJson dataUsingEncoding:NSUTF8StringEncoding] options:0 error:&error];

	if (error) {
		NSLog(@"[Aliucord-iOS] error: %@", error);
		return true;
	}

	if ([json isKindOfClass:[NSDictionary class]]) {
		NSString *commandName = [json objectForKey:@"command"];

		if (commandName == nil) {
			return true;
		}

		NSString *commandID = [json objectForKey:@"id"];
		NSArray *commandParams = [json objectForKey:@"params"];

		NSLog(@"[Aliucord-iOS] command: %@", commandName);

		NSDictionary *response = createResponse(commandID, @"no data");

		if ([commandName isEqualToString:@"list-plugins"]) {
			NSString *plugins = getAvailablePlugins();
			response = createResponse(commandID, plugins);
		}

		if ([commandName isEqualToString:@"install-plugin"]) {
			NSString *result = installPlugin(commandParams[0]);
			response = createResponse(commandID, result);
		}

		if ([commandName isEqualToString:@"uninstall-plugin"]) {
			NSString *result = uninstallPlugin(commandParams[0]);
			response = createResponse(commandID, result);
		}

		NSError *error; 
		NSData *jsonData = [NSJSONSerialization dataWithJSONObject:response options:0 error:&error];

		if (error) {
			NSLog(@"[Aliucord-iOS] error: %@", error);
			return true;
		}

		NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
		NSString *responseString = [NSString stringWithFormat: @"%@%@", @"aliucord://", [jsonString stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLHostAllowedCharacterSet]]];
		NSURL *responseUrl = [NSURL URLWithString:responseString];

		NSLog(@"[Aliucord-iOS] jsonString: %@", jsonString);
		NSLog(@"[Aliucord-iOS] responseString: %@", responseString);
		NSLog(@"[Aliucord-iOS] responseUrl: %@", responseUrl);

		[[UIApplication sharedApplication] openURL:responseUrl options:@{} completionHandler:nil];
	}

	return true;
}

%end