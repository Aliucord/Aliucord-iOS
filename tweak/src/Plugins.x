#import "Aliucord.h"

// Get the path of a plugin via it's name
NSString* getPluginPath(NSString *name) {
  NSString* plugins = getPlugins();

  for (NSString *plugin in [plugins componentsSeparatedByString:@","]) {
    if ([plugin containsString:name]) {
      return [NSString stringWithFormat:@"%@/%@", PLUGINS_PATH, plugin];
    }
  }

  return @"";
}

// Get the name of a plugin via it's url
NSString* getPluginName(NSURL *url) {
  NSString *stripped = [[url lastPathComponent] stringByReplacingOccurrencesOfString:@".disable" withString:@""];
  return [stripped stringByReplacingOccurrencesOfString:@".js" withString:@""];
}

// Create the plugins folder
BOOL createPluginsFolder() {
  NSFileManager *fileManager = [NSFileManager defaultManager];

  if ([fileManager fileExistsAtPath:PLUGINS_PATH]) {
    return false;
  }

  NSError *err;
  [fileManager
    createDirectoryAtPath:PLUGINS_PATH
    withIntermediateDirectories:false
    attributes:nil
    error:&err];

  if (err) {
    return false;
  }

  return true;
}

// Get the list of installed plugins
NSString* getPlugins() {
  NSFileManager *fileManager = [NSFileManager defaultManager];

  NSError *err;
  NSArray *files = [fileManager
                      contentsOfDirectoryAtPath:PLUGINS_PATH
                      error:&err];
  
  if (err || [files count] == 0) {
    return @"";
  }

  NSMutableArray *plugins = [[NSMutableArray alloc] init];
  for (NSString *plugin in files) {
    if (![plugin containsString:@".js"]) {
      continue;
    }

    [plugins addObject:plugin];
  }

  return [plugins componentsJoinedByString:@","];
}

// Check if a plugin exists
BOOL checkPlugin(NSString *name) {
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSString *path = getPluginPath(name);

  if ([fileManager fileExistsAtPath:path]) {
    return true;
  }

  return false;
}

// Install a plugin from an URL
BOOL installPlugin(NSURL *url) {
  NSString *pluginName = getPluginName(url);
  NSString *dest = getPluginPath(pluginName);

  if ([dest isEqualToString:@""]) {
    dest = [NSString stringWithFormat:@"%@/%@.js", PLUGINS_PATH, pluginName];
  }
  
  NSLog(@"pluginName %@", pluginName);
  NSLog(@"dest %@", dest);

  BOOL success = downloadFile(url.absoluteString, dest);
  
  return success;
}

// Delete a plugin
BOOL deletePlugin(NSString *name) {
  if (!checkPlugin(name)) {
    return false;
  }

  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSError *err;
  [fileManager
    removeItemAtPath:getPluginPath(name)
    error:&err];

  if (err) {
    return false;
  }

  return true;
}

BOOL disablePlugin(NSString *name) {
  NSString *path = getPluginPath(name);

  if (!isEnabled(path)) {
    return false;
  }

  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSError *err;
  [fileManager
    moveItemAtPath:path
    toPath:[NSString stringWithFormat:@"%@/%@", PLUGINS_PATH, [NSString stringWithFormat:@"%@.js.disable", name]]
    error:&err];

  if (err) {
    return false;
  }

  return true;
}

BOOL enablePlugin(NSString *name) {
  NSString *path = getPluginPath(name);
  
  if (isEnabled(path)) {
    return false;
  }

  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSError *err;
  [fileManager
    moveItemAtPath:path
    toPath:[NSString stringWithFormat:@"%@/%@", PLUGINS_PATH, [NSString stringWithFormat:@"%@.js", name]]
    error:&err];

  if (err) {
    return false;
  }

  return true;
}

BOOL isEnabled(NSString *name) {
 return ![name containsString:@".disable"];
}

// Wrap a plugin
NSString* wrapPlugin(NSString *code, int pluginID, NSString *name) {
  NSString* plugin = [NSString stringWithFormat:@""\
    "__d(function(...args) {"\
      "try {"\
        "%@"\
      "} catch(err) {"\
        "console.error('Fatal error with %@:', err);"\
      "}"\
    "}, %d, []);"\
    "__r(%d);", code, name, pluginID, pluginID
  ];

  return plugin;
}