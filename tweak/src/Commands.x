#import "Aliucord.h"

// Create a response to a command
NSDictionary* createResponse(NSString *uuid, NSString *data) {
  NSDictionary *response = @{
    @"id": uuid,
    @"data": data
  };

  return response;
}

// Send a response back
void sendResponse(NSDictionary *response) {
  NSError *err; 
  NSData *data = [NSJSONSerialization
                    dataWithJSONObject:response
                    options:0
                    error:&err];

  if (err) {
    return;
  }

  NSString *json = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  NSString *responseString = [NSString stringWithFormat: @"%@%@", ALIUCORD_PROTOCOL, [json stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLHostAllowedCharacterSet]]];
  NSURL *url = [NSURL URLWithString:responseString];

  NSLog(@"json: %@", json);

  [[UIApplication sharedApplication] openURL:url options:@{} completionHandler:nil];
}

// Validate that a command is using the aliucord scheme
BOOL validateCommand(NSString *command) {
  BOOL valid = [command containsString:@"aliucord"];

  if (!valid) {
    NSLog(@"Invalid protocol");
  }

  return valid;
}

// Clean the received command
NSString* cleanCommand(NSString *command) {
  NSString *json = [[command 
            stringByReplacingOccurrencesOfString:ALIUCORD_PROTOCOL
            withString:@""]
          stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];

  NSLog(@"json: %@", json);

  return json;
}

// Parse the command
NSDictionary* parseCommand(NSString *json) {
  NSURLComponents* components = [[NSURLComponents alloc] initWithString:json];
  NSArray *queryItems = components.queryItems;

  NSMutableDictionary *command = [[NSMutableDictionary alloc] init];

  for (NSURLQueryItem *item in queryItems) {
    if ([item.name isEqualToString:@"id"]) {
      command[@"id"] = item.value;
    }

    if ([item.name isEqualToString:@"command"]) {
      command[@"command"] = item.value;
    }

    if ([item.name isEqualToString:@"params"]) {
      command[@"params"] = [item.value componentsSeparatedByString:@","];
    }
  }

  return [command copy];
}

// Handle the command
void handleCommand(NSDictionary *command) {
  NSString *name = [command objectForKey:@"command"];
  if (name == nil) {
    return;
  }

  NSString *uuid = [command objectForKey:@"id"];
  NSArray *params = [command objectForKey:@"params"];

  // List available plugins
  if ([name isEqualToString:@"list-plugins"]) {
    createPluginsFolder();

    NSString *plugins = getPlugins();
    sendResponse(createResponse(uuid, plugins));
    return;
  }

  // Install a plugin
  if ([name isEqualToString:@"install-plugin"]) {
    NSURL *url = [NSURL URLWithString:params[0]];
    if (!url || ![[url pathExtension] isEqualToString:@"js"]) {
      return;
    }

    createPluginsFolder();

    NSString *pluginName = getPluginName(url);
    NSString *title = [[NSString alloc] init];
    NSString *message = [[NSString alloc] init];
    if (checkPlugin(pluginName)) {
      title = @"Plugin already exists";
      message = [NSString stringWithFormat:@"Are you sure you want to overwrite %@?", pluginName];
    } else {
      title = @"Install plugin";
      message = [NSString stringWithFormat:@"Are you sure you want to install %@?", pluginName];
    }

    confirm(title, message, ^() {
      BOOL success = installPlugin(url);
      if (success) {
        if ([uuid isEqualToString:@"-1"]) {
          alert([NSString stringWithFormat:@"%@ has been installed.", pluginName]);
          return;
        }

        sendResponse(createResponse(uuid, [NSString stringWithFormat:@"**%@** has been installed.", pluginName]));
        return;
      }

      if ([uuid isEqualToString:@"-1"]) {
        alert([NSString stringWithFormat:@"An error happened while installing %@.", pluginName]);
        return;
      }

      sendResponse(createResponse(uuid, [NSString stringWithFormat:@"An error happened while installing *%@*.", pluginName]));
    });

    return;
  }

  if ([name isEqualToString:@"uninstall-plugin"]) {
    NSString *pluginName = params[0];

    BOOL exists = checkPlugin(pluginName);
    if (!exists) {
      sendResponse(createResponse(uuid, [NSString stringWithFormat:@"**%@** isn't currently installed.", pluginName]));
      return;
    }

    confirm(@"Uninstall plugin", [NSString stringWithFormat:@"Are you sure you want to uninstall %@?", pluginName], ^() {
      BOOL success = deletePlugin(pluginName);
      if (success) {
        sendResponse(createResponse(uuid, [NSString stringWithFormat:@"**%@** has been removed.", pluginName]));
        return;
      }

      sendResponse(createResponse(uuid, [NSString stringWithFormat:@"An error happened while removed *%@*.", pluginName]));
    });
  }

  if ([name isEqualToString:@"apply-theme"]) {
    BOOL success = saveTheme(params[0], params[1]);

    if (success) {
      sendResponse(createResponse(uuid, @"Theme has been applied."));
      return; 
    }
    
    sendResponse(createResponse(uuid, @"Error applying theme."));
  }

  if ([name isEqualToString:@"remove-theme"]) {
    BOOL success = deleteTheme();

    if (success) {
      sendResponse(createResponse(uuid, @"Theme has been removed. Use `/reload` to reload Discord."));
      return; 
    }
    
    sendResponse(createResponse(uuid, @"Error removing theme."));
  }
}

%hook AppDelegate

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options {  
  NSString *input = url.absoluteString;
	if (!validateCommand(input)) {
    %orig;
    return true;
	}

	NSString *json = cleanCommand(input);
  NSDictionary *command = parseCommand(json);
  handleCommand(command);

  return true;
}

%end