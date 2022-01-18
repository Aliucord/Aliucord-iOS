NSDictionary* createResponse(NSString *commandID, NSString *data);
void createPluginsFolder();
NSString* getAvailablePlugins();
NSString* installPlugin(NSString *url);
NSString* uninstallPlugin(NSString *name);