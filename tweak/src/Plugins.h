#define PLUGINS_PATH [NSString stringWithFormat:@"%@/%@", NSHomeDirectory(), @"Documents/Plugins"]

NSString* getPluginPath(NSString *name);
NSString* getPluginName(NSURL *url);

BOOL createPluginsFolder();
NSString* getPlugins();
BOOL checkPlugin(NSString *name);
BOOL installPlugin(NSURL *url);
BOOL deletePlugin(NSString *name);