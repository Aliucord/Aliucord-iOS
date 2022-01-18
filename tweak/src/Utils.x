#import "Utils.h"

#define PLUGINS_PATH [NSString stringWithFormat:@"%@/%@", NSHomeDirectory(), @"Documents/Plugins/"]


NSDictionary* createResponse(NSString *commandID, NSString *data) {
  NSDictionary *responseDict = @{
    @"id": commandID,
    @"data": data
  };

  return responseDict;
}

void createPluginsFolder() {
  NSFileManager *fileManager = [NSFileManager defaultManager];

  if ([fileManager fileExistsAtPath:PLUGINS_PATH]) {
    return;
  }

  [fileManager createDirectoryAtPath:PLUGINS_PATH withIntermediateDirectories:false attributes:nil error:nil];
}

BOOL downloadPlugin(NSString *pluginUrl) {
  NSFileManager *fileManager = [NSFileManager defaultManager];
	NSURL *url = [NSURL URLWithString:pluginUrl];

  NSString *pluginPath = [NSString stringWithFormat:@"%@%@", PLUGINS_PATH, [url lastPathComponent]];

  if ([fileManager fileExistsAtPath:pluginPath]) {
    return false;
  }

	NSData *urlData = [NSData dataWithContentsOfURL:url];

	if (urlData) {
		[urlData writeToFile:pluginPath atomically:YES];
    return true;
	}

  return false;
}

BOOL removePlugin(NSString *name) {
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSString *pluginPath = [NSString stringWithFormat:@"%@%@.js", PLUGINS_PATH, name];

#ifndef NDEBUG
  NSLog(@"[Aliucord-iOS] pluginPath: %@", pluginPath);
#endif

  if ([fileManager fileExistsAtPath:pluginPath]) {
    [fileManager removeItemAtPath:pluginPath error:nil];
    return true;
  }

  return false;
}

// Get installed plugins
NSString* getAvailablePlugins() {
  createPluginsFolder();
  NSMutableArray *plugins = [[[NSFileManager defaultManager] contentsOfDirectoryAtPath:PLUGINS_PATH error:nil] mutableCopy];

  if ([plugins count] == 0) {
    return @"";
  }
  
  int i;
  for (i = 0; i < [plugins count]; i++) {
    NSString *plugin = [plugins objectAtIndex:i];
    [plugins replaceObjectAtIndex:i withObject:[plugin stringByReplacingOccurrencesOfString:@".js" withString:@""]];
  }

  return [plugins componentsJoinedByString:@","];
}

// Install a plugin from an URL
NSString* installPlugin(NSString *url) {
  createPluginsFolder();
  BOOL success = downloadPlugin(url);

  NSString *pluginName = [[[NSURL URLWithString:url] lastPathComponent] stringByReplacingOccurrencesOfString:@".js" withString:@"" ];

  if (success) {
    return [NSString stringWithFormat:@"Installed %@.", pluginName];
  }

  return [NSString stringWithFormat:@"Unable to install %@.\nURL might be invalid or a plugin with the same name already exists.", pluginName];
}

NSString* uninstallPlugin(NSString *name) {
  createPluginsFolder();
  BOOL success = removePlugin(name);

  if (success) {
    return [NSString stringWithFormat:@"Uninstalled %@.", name];
  }

  return [NSString stringWithFormat:@"Plugin %@ couldn't be found.", name];
}